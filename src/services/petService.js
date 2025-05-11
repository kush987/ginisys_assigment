const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { PET }= require('../models/Pet');
const { User }= require('../models/Users');
const { UPLOAD_PATH } = require('../config/env');
const CustomError = require('../middlewares/CustomError');

const createPet = async (payload) => {
    try {
        const user = await User.findByPk(payload.user.id);
        if (!user) {
            throw new CustomError('User not found', 404);
        }

        const pet = await PET.create({
            pet_name: payload.body.pet_name,
            breed: payload.body.breed,
        }); 

        await user.addPET(pet); // creates row in UserPets

        return pet;
    } catch (error) {
        console.error('Error creating pet:', error.message);
        throw new CustomError(error.message, 500);
    }
};

const upload = (petId, file) => {
    return new Promise((resolve, reject) => {
        // Find the pet by its ID
        PET.findOne({ where: { id: petId } })
            .then(pet => {
                if (!pet) {
                    return reject(new CustomError('Pet not found', 404));
                }

                // If the pet already has a file, delete the previous one
                if (pet.file_name && pet.original_name) {
                    const oldFilePath = path.join(UPLOAD_PATH, pet.file_name);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
                const filename = `${Date.now()}_${file.name}`;
                const filePath = path.join(UPLOAD_PATH, filename);

                sharp(file.data).resize(800).toFile(filePath)
                    .then(() => {
                        pet.update({
                            file_name: filename,
                            original_name: file.name,
                            mime_type: file.mimetype,
                            size: file.size
                        })
                            .then(updatedPet => {
                                resolve(updatedPet);
                            })
                            .catch(updateError => {
                                reject(new CustomError('Error updating pet record', 500));
                            });
                    })
                    .catch(sharpError => {
                        reject(new CustomError('Error processing image', 500));
                    });
            })
            .catch(error => {
                reject(new CustomError('Error fetching pet from database', 500));
            });
    });
};


const getAlldogsImages = (req) =>{
    const { page = 1, size = 10 } = req.query;

    const limit = size;
    const offset = (page - 1) * size;

    return new Promise((resolve, reject) => {
        PET.findAndCountAll({
            include: [
                {
                    model: User,
                    where: { id: req.user.id },
                    attributes: [],
                    through: { attributes: [] }
                }
            ],
            limit,
            offset,
        })
        .then(result => {
            const totalPages = Math.ceil(result.count / size);
            resolve({
                pets: result.rows,
                totalCount: result.count,
                totalPages: totalPages,
                currentPage: page,
                pageSize: size,
            });
        })
        .catch(error => reject(new CustomError(error.message, 500)));
    });
};

const getById = (req) => {
    return new Promise((resolve, reject) => {
        const { id } = req.params;
        
        PET.findByPk(id,{
            include: [
                {
                    model: User,
                    where: { id: req.user.id },
                    attributes: [],
                    through: { attributes: [] }
                }
            ]
        }).then(pet => {
                if (!pet) {
                    reject(new CustomError('Pet not found.', 404));
                } else {
                    const plainDog = pet.get({ plain: true });
                    if(plainDog.file_name){
                        resolve(path.resolve(UPLOAD_PATH, plainDog.file_name));
                    }else {
                        reject(new CustomError("Error Image is not Uploaded", 404));
                    }
                }
            })
            .catch(error => {
                reject(error);
            });
    });
};

const updatePet = (payload) => {
    return new Promise((resolve, reject) => {
        PET.findByPk(payload.params.id, {
            include: [{
                model: User,
                where: { id: payload.user.id },
                attributes: [],
                through: { attributes: [] }
            }]
        })
        .then(pet => {
            if (!pet) {
                return reject(new CustomError('Pet not found', 404));
            }

            if (payload.body.pet_name) {
                pet.pet_name = payload.body.pet_name;
            }
            if (payload.body.breed) {
                pet.breed = payload.body.breed;
            }
            return pet.save(); 
        })
        .then(() => {
            
            resolve(PET.findByPk(payload.params.id));  // Resolve with the updated pet
        })
        .catch(error => {
            reject(new CustomError(error.message || 'Error updating pet', 500));
        });
    });
};


const deleteById = async (payload) => {
    return new Promise((resolve, reject) => {
        PET.findByPk(payload.params.id, {
            include: [
                {
                    model: User,
                    where: { id: payload.user.id },
                    attributes: [],
                    through: { attributes: [] }
                }
            ]
        })
        .then(pet => {
            if (!pet) {
                return reject(new CustomError("Pet not found", 404));
            }
            if(pet.file_name){
                const filePath = path.join(UPLOAD_PATH, pet.file_name);
                if (fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (err) {
                        return reject(new CustomError('Error deleting image file', 500));
                    }
                }
            }

            return pet.destroy();
        })
        .then(() => {
            resolve({ message: 'Pet deleted successfully' });
        })
        .catch(error => {
            reject(
                error instanceof CustomError
                    ? error
                    : new CustomError(error.message || 'Error deleting pet', 500)
            );
        });
    });
};

const deletePetImage = async (payload) => {
    return new Promise((resolve, reject) => {
        PET.findByPk(payload.params.id, {
            include: [
                {
                    model: User,
                    where: { id: payload.user.id },
                    attributes: [],
                    through: { attributes: [] }
                }
            ]
        })
        .then(pet => {
            if (!pet) {
                return reject(new CustomError("Pet not found", 404));
            }
            if(pet.file_name){
                const filePath = path.join(UPLOAD_PATH, pet.file_name);
                if (fs.existsSync(filePath)) {
                    try {
                        fs.unlinkSync(filePath);
                    } catch (err) {
                        return reject(new CustomError('Error deleting image file', 500));
                    }
                }
            }
            pet.file_name = '';
            pet.original_name= '';
            pet.size = 0;
            pet.mime_type='';
            return pet.save();
        })
        .then(() => {
            resolve({ message: 'Pet deleted successfully' });
        })
        .catch(error => {
            reject(
                error instanceof CustomError
                    ? error
                    : new CustomError(error.message || 'Error deleting pet', 500)
            );
        });
    });
}

module.exports = {
    createPet,
    upload,
    getAlldogsImages,
    getById,
    updatePet,
    deleteById,
    deletePetImage
}


