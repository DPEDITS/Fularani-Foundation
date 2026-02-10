import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import reactLogo from "../assets/logo.jpg";
import reactLogoSvg from "../assets/react.svg";

const numberToWords = (num) => {
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const inWords = (n) => {
        if (n < 20) return a[n];
        const digit = n % 10;
        if (n < 100) return b[Math.floor(n / 10)] + (digit ? ' ' + a[digit] : '');
        if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + inWords(n % 100) : '');
        if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + inWords(n % 1000) : '');
        if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + inWords(n % 100000) : '');
        return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + inWords(n % 10000000) : '');
    };

    return inWords(num) + ' Only';
};

const loadImage = (url) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => {
            // If it's an SVG, we need to draw it to a canvas to get a PNG-like format that jsPDF understands better
            if (url.endsWith('.svg') || url.startsWith('data:image/svg+xml')) {
                const canvas = document.createElement("canvas");
                // Use a higher scale for better quality
                const scale = 4;
                canvas.width = img.width * scale || 200 * scale;
                canvas.height = img.height * scale || 200 * scale;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/png"));
            } else {
                resolve(img);
            }
        };
        img.onerror = (err) => {
            console.error("Image load error:", err);
            resolve(null);
        };
    });
};

export const generateDonationReceipt = async (donation, user) => {
    try {
        console.log("Generating official receipt for donation:", donation);
        console.log("Using donor information:", user);
        if (!donation) throw new Error("Donation data is missing");

        // 1. Load All Images First
        const [logoImg, sigSvgImg] = await Promise.all([
            loadImage(reactLogo),
            loadImage(reactLogoSvg)
        ]);

        const doc = new (jsPDF.jsPDF || jsPDF)();
        const pageWidth = doc.internal.pageSize.getWidth();
        const leftMargin = 20;
        const rightLabelX = 75; // Increased from 60
        const valueX = 80;      // Increased from 65

        // Fonts and Colors
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        // Logo Section
        if (logoImg) {
            // Using "JPEG" or "PNG" as hint. Since user changed to logo.jpg, "JPEG" is appropriate.
            const ext = reactLogo.split('.').pop().toUpperCase();
            doc.addImage(logoImg, ext === 'JPG' ? 'JPEG' : ext, 15, 12, 40, 40);
        } else {
            // Fallback to placeholder box if image fails
            doc.setDrawColor(200);
            doc.setLineWidth(0.1);
            doc.rect(15, 12, 40, 40);
            doc.setFontSize(8);
            doc.setTextColor(150);
            doc.text("LOGO", 35, 32, { align: "center" });
            doc.setTextColor(0, 0, 0);
        }

        // Header Section
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text("FULARANI FOUNDATION", pageWidth / 2, 20, { align: "center" });

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.text("(Registered Section 8 Company)", pageWidth / 2, 26, { align: "center" });

        doc.setFontSize(9);
        doc.text("At- Kusagadia, Plot No-139/1363,", pageWidth / 2, 32, { align: "center" });
        doc.text("Po- Baudpur, Bhadrak, Odisha 756181", pageWidth / 2, 37, { align: "center" });
        doc.text("CIN: U80900OR2022NPL039987", pageWidth / 2, 42, { align: "center" });
        doc.text("Phone No: 94396 65220", pageWidth / 2, 47, { align: "center" });
        doc.text("Mail ID: info@fularanifoundation.org", pageWidth / 2, 52, { align: "center" });

        // Title
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text("DONATION RECEIPT", pageWidth / 2, 65, { align: "center" });
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0);
        doc.line(pageWidth / 2 - 30, 67, pageWidth / 2 + 30, 67);

        // Receipt Info Section
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(30, 30, 30);

        const receiptInfoY = 80;
        doc.text("Receipt No", leftMargin, receiptInfoY);
        doc.text(":", rightLabelX, receiptInfoY);
        doc.setFont("helvetica", "bold");
        const receiptNo = donation.receiptNumber || donation.paymentId?.slice(-5) || "N/A";
        doc.text(receiptNo, valueX, receiptInfoY);
        doc.setDrawColor(200);
        doc.line(valueX, receiptInfoY + 2, valueX + 40, receiptInfoY + 2);

        doc.setFont("helvetica", "normal");
        doc.text("Dated :", 130, receiptInfoY);
        doc.setFont("helvetica", "bold");
        const donationDate = donation.donatedAt ? new Date(donation.donatedAt).toLocaleDateString("en-GB", { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A";
        doc.text(donationDate, 150, receiptInfoY);
        doc.line(150, receiptInfoY + 2, pageWidth - leftMargin, receiptInfoY + 2);

        // Main Rows Helper
        let currentY = 95; // Started at 95 to avoid overlap with receipt info
        const rowHeight = 10;

        const addRow = (label, value) => {
            doc.setFont("helvetica", "normal");
            doc.setTextColor(50, 50, 50);
            doc.text(label, leftMargin, currentY);
            doc.text(":", rightLabelX, currentY);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 0, 0);

            const splitValue = doc.splitTextToSize(value || "N/A", pageWidth - valueX - leftMargin);
            doc.text(splitValue, valueX, currentY);

            const lines = splitValue.length;
            doc.setDrawColor(220);
            for (let i = 0; i < lines; i++) {
                const lineY = currentY + 1.5 + (i * 6);
                doc.line(valueX, lineY, pageWidth - leftMargin, lineY);
            }

            currentY += rowHeight + ((lines - 1) * 6);
        };

        addRow("Received with thanks from", (user?.username || "Valued Donor").toUpperCase());
        addRow("Address", user?.address || "N/A");
        addRow("Phone No", user?.phone || "N/A");
        addRow("Bearing ID No and Type", `${user?.panNumber || "N/A"}, PAN`);
        addRow("the sum of Rs.", `${typeof donation.amount === 'number' ? donation.amount.toLocaleString("en-IN") : donation.amount}/-`);
        addRow("in words", numberToWords(donation.amount).toUpperCase());
        addRow("towards", "Mission Mobility & Mission Period Pride");
        addRow("by mode of", `${donation.paymentGateway || "Online Transaction"} #${donation.paymentId || "N/A"}`);
        addRow("Remarks", donation.remarks || "N/A");
        addRow("eligible for deduction under section", "Section 80G of the Income Tax Act, 1961.");

        // Side-by-Side Section (T&C on left, Signature on right)
        const commonY = currentY + 10;
        const sigX = 135;

        // 1. Terms and Conditions (Left Side)
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Term & Conditions:", leftMargin, commonY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        const tnc = [
            "• Cheque or DD is subjected to realisation.",
            "• This Receipt is exempt from levy of StampDuty vide Exemption (b) of Article 53 in Schedule 1 of \"The Indian Stamp Act, 1899\".",
            "• Our Registration No is 39987 (Section- 8 NGO)",
            "• Our Income Tax PAN is AAFCF0939B.",
            "• Our Income Tax TAN is BBNF00564E.",
            "• Our Income Tax Unique Registration No (URN) u/s 12A is AAFCF0939BE20231 dated 23-10-2023."
        ];

        const tncWidth = sigX - leftMargin - 10;
        let tncY = commonY + 6;

        tnc.forEach((line) => {
            const splitLine = doc.splitTextToSize(line, tncWidth);
            doc.text(splitLine, leftMargin + 2, tncY);
            tncY += (splitLine.length * 4);
        });

        // 2. Signature Section (Right Side - starts at commonY)
        const sigY = commonY + 30; // Position foundation name relative to commonY

        // Stamp Image (logo.jpg) - Positioned above Foundation Name
        if (logoImg) {
            const ext = reactLogo.split('.').pop().toUpperCase();
            doc.addImage(logoImg, ext === 'JPG' ? 'JPEG' : ext, sigX + 10, sigY - 35, 25, 25);
        }

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("For Fularani Foundation", sigX, sigY);

        // Authorized Signature (reactLogoSvg)
        if (sigSvgImg) {
            doc.addImage(sigSvgImg, "PNG", sigX - 5, sigY + 3, 40, 12);
        } else {
            doc.setDrawColor(200);
            doc.setLineWidth(0.1);
            doc.rect(sigX - 5, sigY + 5, 40, 10);
            doc.setFontSize(7);
            doc.setTextColor(150);
            doc.text("AUTHORIZED SIGNATURE", sigX + 15, sigY + 11, { align: "center" });
            doc.setTextColor(0, 0, 0);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("Trustee/Authorised Signatory", sigX - 5, sigY + 22);

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100);
        doc.text("This is a computer generated receipt. Thank You for the donation.", pageWidth / 2, 285, { align: "center" });

        // Save
        doc.save(`Fularani_Official_Receipt_${receiptNo}.pdf`);
        console.log("Official PDF generated successfully");

    } catch (error) {
        console.error("Failed to generate official PDF receipt:", error);
        alert("Failed to generate official PDF receipt. Please check the console for details.");
    }
};

export const generateDonationsReport = (donations, user) => {
    try {
        console.log("Generating donations report for:", donations);
        if (!donations || donations.length === 0) {
            alert("No donation history found to export.");
            return;
        }

        const doc = new (jsPDF.jsPDF || jsPDF)();
        const pageWidth = doc.internal.pageSize.getWidth();
        const rose500 = "#F43F5E";
        const slate800 = "#1E293B";
        const slate500 = "#64748B";

        // Header
        doc.setTextColor(rose500);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("Fularani Foundation", 20, 30);

        doc.setTextColor(slate800);
        doc.setFontSize(14);
        doc.text("Donation History Report", pageWidth - 20, 30, {
            align: "right",
        });

        doc.setFontSize(10);
        doc.setTextColor(slate500);
        doc.setFont("helvetica", "normal");
        doc.text(`Donor: ${user?.username || "Digital Donor"}`, 20, 40);
        doc.text(
            `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
            pageWidth - 20,
            40,
            { align: "right" },
        );

        doc.setDrawColor(230, 230, 230);
        doc.line(20, 45, pageWidth - 20, 45);

        const tableColumn = ["Date", "Amount", "Method", "Type", "Status"];
        const tableRows = donations.map((d) => [
            d.donatedAt ? new Date(d.donatedAt).toLocaleDateString("en-IN") : "N/A",
            `INR ${typeof d.amount === 'number' ? d.amount.toLocaleString("en-IN") : d.amount}`,
            d.paymentGateway || "Razorpay",
            d.isRecurring ? "Recurring" : "One-time",
            "Success",
        ]);

        autoTable(doc, {
            startY: 55,
            head: [tableColumn],
            body: tableRows,
            theme: "striped",
            headStyles: { fillColor: rose500, textColor: "#FFFFFF" },
            styles: { fontSize: 9 },
            margin: { left: 20, right: 20 },
        });

        const total = donations.reduce((sum, d) => sum + (typeof d.amount === 'number' ? d.amount : 0), 0);
        const finalY = (doc.lastAutoTable && doc.lastAutoTable.finalY) ? doc.lastAutoTable.finalY + 10 : 200;

        doc.setFont("helvetica", "bold");
        doc.text(
            `Total Contributed: INR ${total.toLocaleString("en-IN")}`,
            pageWidth - 20,
            finalY,
            { align: "right" },
        );

        doc.save(`Fularani_Donation_History_${user?.username || "Donor"}.pdf`);
        console.log("Donations report generated successfully");
    } catch (error) {
        console.error("Failed to generate donations report:", error);
        alert("Failed to generate donations report. Please check the console for details.");
    }
};
