import api from './axios'

export const getAllIngredients = () =>
  api.get('/ingredients')