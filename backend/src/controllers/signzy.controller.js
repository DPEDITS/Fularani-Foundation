import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Donor } from "../models/donor.model.js";
import { Volunteer } from "../models/volunteer.model.js";

// ─── Cashfree PAN Lite Verification (₹2/API) ───────────────────────────────
// Docs: https://docs.cashfree.com/reference/pan-lite-verification
// Checks PAN details, matches name + DOB
const verifyPANLite = asyncHandler(async (req, res) => {
    const { panNumber, name, dob } = req.body;

    if (!panNumber?.trim()) {
        throw new ApiError(400, "PAN Number is required");
    }

    if (!name?.trim() || name.trim() === "VerifyUser") {
        throw new ApiError(400, "Your full name (as on PAN) is required for verification");
    }

    if (!dob?.trim()) {
        throw new ApiError(400, "Date of birth is required for verification");
    }

    // Basic format validation before calling external API
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const pan = panNumber.trim().toUpperCase();

    if (!panRegex.test(pan)) {
        throw new ApiError(400, "Invalid PAN Number format. Expected: ABCDE1234F");
    }

    // --- Prevent duplicate PAN registrations BEFORE calling Cashfree API ---
    // This saves API costs and explicitly enforces one PAN per user account!
    const existedDonorPan = await Donor.findOne({ panNumber: new RegExp(`^${pan}$`, 'i') });
    if (existedDonorPan) {
        throw new ApiError(409, "This PAN Number is already registered to an existing Donor account!");
    }

    const existedVolunteerPan = await Volunteer.findOne({ panNumber: new RegExp(`^${pan}$`, 'i') });
    if (existedVolunteerPan) {
        throw new ApiError(409, "This PAN Number is already registered to an existing Volunteer account!");
    }

    const clientId = process.env.CASHFREE_CLIENT_ID;
    const clientSecret = process.env.CASHFREE_CLIENT_SECRET;
    const isProduction = process.env.CASHFREE_ENV === "production";
    const baseUrl = isProduction
        ? "https://api.cashfree.com"
        : "https://sandbox.cashfree.com";

    // Build request body for PAN Lite API
    const verificationId = `pan_lite_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
    const requestBody = {
        verification_id: verificationId,
        pan: pan,
        name: name?.trim() || "VerifyUser", // Cashfree now requires the name field
        dob: "1990-01-01", // Default DOB since Cashfree now requires the dob field
    };
    if (dob?.trim()) {
        const ddmmyyyyRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
        const match = dob.trim().match(ddmmyyyyRegex);
        if (match) {
            const [_, day, month, year] = match;
            requestBody.dob = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        } else {
            requestBody.dob = dob.trim();
        }
    }

    // --- Developer Sandbox Local Bypass for Cashfree Test PANs ---
    // If we're not in production and the user enters known Cashfree test PANs,
    // we bypass the API call to avoid IP whitelisting errors and return mock success.
    if (!isProduction) {
        const testPans = ["ABCPV1234D", "XYZP4321W", "AZJPG7110R", "ABCCD8000T", "XYZH2000L", "AAAHU4383C", "AMJCL2021N", "ABCDE5930G"];
        const invalidTestPans = ["DEFPV0126D", "TUVP5678W", "LMNCD8010T", "EFGH2020L"];

        if (testPans.includes(pan)) {
            const isJohnDoePan = pan === "ABCDE5930G";
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        panNumber: pan,
                        holderName: isJohnDoePan ? "JOHN DOE" : "CASHFREE TEST HOLDER",
                        dateOfBirth: isJohnDoePan ? "1999-01-27" : "1990-01-01",
                        isValid: true,
                        panStatus: "E",
                        panStatusDescription: "Valid",
                        nameMatched: true,
                        dobMatched: true,
                        aadhaarLinked: true,
                        verificationId: verificationId,
                    },
                    "PAN verified successfully (Sandbox Mock)"
                )
            );
        }

        if (invalidTestPans.includes(pan)) {
            return res.status(200).json(
                new ApiResponse(
                    200,
                    {
                        panNumber: pan,
                        holderName: null,
                        dateOfBirth: null,
                        isValid: false,
                        panStatus: "N",
                        panStatusDescription: "Does not exist",
                        nameMatched: false,
                        dobMatched: false,
                        aadhaarLinked: false,
                        verificationId: verificationId,
                    },
                    "PAN verification failed — Does not exist (Sandbox Mock)"
                )
            );
        }
    }

    if (!clientId || !clientSecret) {
        throw new ApiError(
            500,
            "Cashfree credentials are not configured on the server"
        );
    }

    // Call Cashfree PAN Lite API
    const cashfreeRes = await fetch(`${baseUrl}/verification/pan-lite`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-client-id": clientId,
            "x-client-secret": clientSecret,
            "x-api-version": "2023-12-01",
        },
        body: JSON.stringify(requestBody),
    });

    // Handle non-OK responses
    if (!cashfreeRes.ok) {
        const errBody = await cashfreeRes.text();
        console.error(
            "Cashfree PAN Lite verification failed:",
            cashfreeRes.status,
            errBody
        );

        if (cashfreeRes.status === 401 || cashfreeRes.status === 403) {
            throw new ApiError(502, `Cashfree authentication failed. Status: ${cashfreeRes.status}. Details: ${errBody}`);
        }
        if (cashfreeRes.status === 422) {
            throw new ApiError(400, `Invalid PAN number provided. Details: ${errBody}`);
        }
        if (cashfreeRes.status === 429) {
            throw new ApiError(429, "Too many verification requests. Please try again later.");
        }

        throw new ApiError(502, `PAN verification service error (${cashfreeRes.status}): ${errBody || "unavailable"}`);
    }

    const data = await cashfreeRes.json();

    /*
     * Cashfree PAN Lite response example:
     * {
     *   "verification_id": "pan_lite_...",
     *   "reference_id": 12345,
     *   "pan": "ABCPV1234D",
     *   "name": "JOHN DOE",
     *   "dob": "1990-01-15",
     *   "pan_status": "E",        // E=Valid, N=Not found, X=Deactivated, F=Fake, D=Deleted
     *   "status": "VALID",
     *   "name_match": "Y",        // Y or N (only if name was provided)
     *   "dob_match": "Y",         // Y or N (only if dob was provided)
     *   "aadhaar_seeding_status": "Y",
     *   "aadhaar_seeding_status_desc": "Aadhaar is linked to PAN"
     * }
     */

    // PAN is valid when pan_status is "E" (exists/valid) or "EC" (valid, marked Acquisition)
    const validStatuses = ["E", "EC"];
    const isPanValid = validStatuses.includes(data.pan_status) || data.status === "VALID";
    
    const nameMatched = data.name_match === "Y";
    const dobMatched = data.dob_match === "Y";

    // Enforce Strict Name + DOB Double-Lock Matching
    const isValid = isPanValid && nameMatched && dobMatched;

    const holderName = data.name || null;
    const dateOfBirth = data.dob || null;

    // Map pan_status codes to human-readable descriptions
    const panStatusMap = {
        "E": "Valid",
        "EC": "Valid (Acquisition)",
        "N": "Does not exist",
        "X": "Deactivated",
        "F": "Fake",
        "D": "Deleted",
        "EA": "Valid (Amalgamation)",
        "ED": "Valid (Death)",
        "EI": "Valid (Dissolution)",
        "EL": "Valid (Liquidated)",
    };

    const panStatusDesc = panStatusMap[data.pan_status] || data.pan_status || "Unknown";

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                panNumber: data.pan || pan,
                holderName,
                dateOfBirth,
                isValid,
                panStatus: data.pan_status || null,
                panStatusDescription: panStatusDesc,
                nameMatched,
                dobMatched,
                aadhaarLinked: data.aadhaar_seeding_status === "Y",
                verificationId: data.verification_id || verificationId,
            },
            isValid
                ? "PAN verified successfully"
                : (isPanValid && (!nameMatched || !dobMatched)
                    ? "PAN verification failed — The provided details do not match the PAN records."
                    : `PAN verification failed — ${panStatusDesc}`)
        )
    );
});

export { verifyPANLite };
