import { Document } from "../models/document.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Create new document
const createDocument = asyncHandler(async (req, res) => {
    const { name, link, category } = req.body;

    if (!name || !link || !category) {
        throw new ApiError(400, "Name, link, and category are required");
    }

    const document = await Document.create({
        name,
        link,
        category
    });

    if (!document) {
        throw new ApiError(500, "Failed to create document");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, document, "Document created successfully"));
});

// Get all documents
const getAllDocuments = asyncHandler(async (req, res) => {
    const { category } = req.query;
    const query = category ? { category } : {};

    const documents = await Document.find(query).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, documents, "Documents retrieved successfully"));
});

// Get document by ID
const getDocumentById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const document = await Document.findById(id);

    if (!document) {
        throw new ApiError(404, "Document not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, document, "Document retrieved successfully"));
});

// Update document
const updateDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, link, category } = req.body;

    const document = await Document.findByIdAndUpdate(
        id,
        { name, link, category },
        { new: true, runValidators: true }
    );

    if (!document) {
        throw new ApiError(404, "Document not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, document, "Document updated successfully"));
});

// Delete document
const deleteDocument = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const document = await Document.findByIdAndDelete(id);

    if (!document) {
        throw new ApiError(404, "Document not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Document deleted successfully"));
});

export {
    createDocument,
    getAllDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument
};
