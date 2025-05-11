const { createPet, upload, getAlldogsImages, getById, updatePet, deleteById, deletePetImage } = require('../../src/services/petService');
const { PET } = require('../../src/models/Pet');
const { User } = require('../../src/models/Users');
const CustomError = require('../../src/middlewares/CustomError');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

jest.mock('../../src/models/Pet');
jest.mock('../../src/models/Users');
jest.mock('fs');
jest.mock('sharp');

describe('Pet Service Tests', () => {
  const userPayload = { id: 1 };
  const petPayload = { pet_name: 'Bella', breed: 'Labrador' };
  const petId = 1;
  const file = {
    name: 'test.jpg',
    data: Buffer.from('fakeImageData'),
    mimetype: 'image/jpeg',
    size: 1234,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a pet successfully', async () => {
    const mockUser = { id: 1, addPET: jest.fn() };
    const createdPet = { id: petId, ...petPayload };

    User.findByPk.mockResolvedValue(mockUser);
    PET.create.mockResolvedValue(createdPet);

    const result = await createPet({ user: userPayload, body: petPayload });

    expect(PET.create).toHaveBeenCalledWith({ pet_name: 'Bella', breed: 'Labrador' });
    expect(mockUser.addPET).toHaveBeenCalledWith(createdPet);
    expect(result).toEqual(createdPet);
  });

  it('should upload an image for the pet successfully', async () => {
    const pet = {
      id: petId,
      update: jest.fn().mockResolvedValue(true),
    };
    PET.findOne.mockResolvedValue(pet);
    sharp.mockReturnValue({ resize: jest.fn().mockReturnThis(), toFile: jest.fn().mockResolvedValue() });
    fs.existsSync.mockReturnValue(true);

    const result = await upload(petId, file);

    expect(sharp).toHaveBeenCalledWith(file.data);
    expect(pet.update).toHaveBeenCalledWith({
      file_name: expect.any(String),
      original_name: file.name,
      mime_type: file.mimetype,
      size: file.size,
    });
    expect(result).toBe(true);
  });

  it('should get all dogs images successfully', async () => {
    const pet = { id: petId, ...petPayload };
    const req = { query: { page: 1, size: 10 }, user: { id: 1 } };

    PET.findAndCountAll.mockResolvedValue({ count: 1, rows: [pet] });

    const result = await getAlldogsImages(req);

    expect(result.pets).toEqual([pet]);
    expect(result.totalCount).toBe(1);
    expect(result.totalPages).toBe(1);
  });

  it('should get pet by ID successfully', async () => {
    const pet = {
      get: jest.fn().mockReturnValue({ file_name: 'dog.jpg' })
    };
    PET.findByPk.mockResolvedValue(pet);
    jest.spyOn(path, 'resolve').mockReturnValue('/uploads/dog.jpg');

    const req = { params: { id: petId }, user: { id: 1 } };
    const result = await getById(req);

    expect(result).toBe('/uploads/dog.jpg');
  });

  it('should update pet details successfully', async () => {
    const pet = {
    ...petPayload,
      save: jest.fn(),
    };
    PET.findByPk.mockResolvedValue(pet);

    const req = { params: { id: petId }, body: { pet_name: 'Max', breed: 'Poodle' }, user: { id: 1 } };
    const updatedPet = await updatePet(req);

    expect(pet.pet_name).toBe('Max');
    expect(pet.breed).toBe('Poodle');
    expect(pet.save).toHaveBeenCalled();
    expect(updatedPet).toEqual(pet);
  });

  it('should delete pet image successfully', async () => {
    const pet = {
      file_name: 'dog.jpg',
      original_name: 'dog.jpg',
      mime_type: 'image/jpeg',
      size: 1000,
      save: jest.fn(),
    };
    PET.findByPk.mockResolvedValue(pet);
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockReturnValue(undefined);

    const req = { params: { id: petId }, user: { id: 1 } };
    const result = await deletePetImage(req);

    expect(pet.file_name).toBe('');
    expect(pet.original_name).toBe('');
    expect(pet.size).toBe(0);
    expect(pet.mime_type).toBe('');
    expect(pet.save).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Pet deleted successfully' });
  });

  it('should delete pet by ID successfully', async () => {
    const pet = {
      destroy: jest.fn(),
      file_name: 'dog.jpg',
    };
    PET.findByPk.mockResolvedValue(pet);
    fs.existsSync.mockReturnValue(true);
    fs.unlinkSync.mockReturnValue(undefined);

    const req = { params: { id: petId }, user: { id: 1 } };
    const result = await deleteById(req);

    expect(pet.destroy).toHaveBeenCalled();
    expect(result).toEqual({ message: 'Pet deleted successfully' });
  });
});