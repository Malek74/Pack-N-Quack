import express from 'express';
import {
    createTag,
    deleteTag,
    getAllTags,
    updateTag
} from '../controllers/tagController.js';
import { protect } from '../middleware/authenticator.js';
// import { isTourismGovernor } from '../middleware/auth.js'; 

const router = express.Router();

// // All tag-related routes are protected with the isTourismGovernor middleware

// // Route to create a tag
// router.post('/tags', isTourismGovernor, createTag);

// // Route to delete a tag by name_tag
// router.delete('/tags/:name_tag', isTourismGovernor, deleteTag);

// // Route to edit the name of a tag by name_tag
// router.patch('/tags/:name_tag', isTourismGovernor, editTagName);

// // Route to add options to a tag by name_tag
// router.put('/tags/:name_tag/options', isTourismGovernor, addTagOptions);

// // Route to remove options from a tag by name_tag
// router.delete('/tags/:name_tag/options', isTourismGovernor, removeTagOptions);

// // Route to modify a specific option within a tag by name_tag
// router.patch('/tags/:name_tag/options', isTourismGovernor, modifyTagOption);

// export default router;



// Routes for tag management
router.post('/', createTag); // Create a new tag
router.delete('/', deleteTag); // Delete a tag by name_tag
router.get('/', getAllTags); // Get all tags
router.put('/', updateTag); // Modify an option in a tag by name_tag


export default router;
