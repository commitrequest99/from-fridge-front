import api from './axios'

export const getAllRecipes = (search) =>
  api.get('/recipes', { params: search ? { search } : {} })

export const getRecipeDetails = (title) =>
  api.get(`/recipes/${title}`)