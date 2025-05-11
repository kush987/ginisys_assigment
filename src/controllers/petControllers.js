const petService = require('../services/petService');

const createPet = async(req, res,next) =>{
    try{
        const pet = await petService.createPet(req);
        return res.status(201).json(pet);
    }catch(err) {
        return next(err);
    }
}
const uploadPetImage = async(req, res, next) => {
    try{
        const petId = req.params.id;
        const pet = await petService.upload(petId, req.files.image);
        return res.status(201).json(pet);
    } catch(err){
        return next(err);    
    }
}

const getAllPets = async(req, res, next) =>{
    try{
        const pets = await petService.getAlldogsImages(req);
        return res.status(200).json(pets);
    } catch(err){
        return next(err);
    }
}

const getPet = async (req, res, next) =>{
    try{
        const pet = await petService.getById(req);
        return res.sendFile(pet);
    } catch(err){
       return next(err);
    }
}

const updatePet = async (req, res, next) =>{
    try{
        const updated = await petService.updatePet(req);
        return res.status(200).json(updated);
    } catch(err){
        return next(err);
    }
}

const deletePet = async (req, res, next) => {
    try{
        const message = await petService.deleteById(req);
        return res.status(200).json(message);
    }catch (err) {
        return next(err);
    }
} 
const deletePetImage = async( req, res, next) => {
    try{
        const message = await petService.deletePetImage(req);
        return res.status(200).json(message);
    }catch (err){
        return next(err);
    }
}

  
module.exports = {
    createPet,
    uploadPetImage,
    getAllPets,
    getPet,
    updatePet,
    deletePet,
    deletePetImage
}