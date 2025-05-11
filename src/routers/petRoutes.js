const express = require('express');
const validate = require('../middlewares/validate');
const { petSchema } = require('../utils/schemaValidator');
const router = express.Router();
const petController = require('../controllers/petControllers');
const authenticate = require('../middlewares/authHandler');

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/pets/create:
 *   post:
 *     summary: Create a Pet
 *     tags: [Pet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pet_name
 *               - breed
 *             properties:
 *               pet_name:
 *                 type: string
 *               breed:
 *                 type: string
 *     responses:
 *       401:
 *         description: Unauthorize
 *       201:
 *         description: Image uploaded
 */
router.post('/create', authenticate, validate(petSchema), petController.createPet);

/**
 * @swagger
 * /api/pets/{id}/upload:
 *   post:
 *     summary: Upload and Update a Pet image
 *     tags: [Pet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the pet (dog)
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded
 */
router.post('/:id/upload', authenticate, petController.uploadPetImage);

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Get list of Pets
 *     tags: [Pet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of pets per page
 *     responses:
 *       200:
 *         description: List of images
 */
router.get('/', authenticate, petController.getAllPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Get a Pet image by ID
 *     tags: [Pet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Image file
 *       404:
 *         description: Not found
 */
router.get('/:id', authenticate, petController.getPet);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Update a Pet name and breed
 *     tags: [Pet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *        application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pet_name
 *               - breed
 *             properties:
 *               pet_name:
 *                 type: string
 *               breed:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated image metadata
 *       404:
 *         description: Not found
 */
router.put('/:id', authenticate, validate(petSchema), petController.updatePet);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Delete a Pet
 *     tags: [Pet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/:id', authenticate, petController.deletePet);

/**
 * @swagger
 * /api/pets/{id}/image:
 *   delete:
 *     summary: Delete a Pet Image
 *     tags: [Pet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pet Image deleted successfully
 *       404:
 *         description: Not found
 */
router.delete('/:id/image', authenticate, petController.deletePetImage);

module.exports = router;
