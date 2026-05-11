import api from './axios'

export const getFridge = () =>
  api.get('/user/fridge')

export const addToFridge = (ingredientId) =>
  api.post(`/user/fridge/${ingredientId}`)

export const removeFromFridge = (ingredientId) =>
  api.delete(`/user/fridge/${ingredientId}`)

export const matchRecipes = () =>
  api.get('/user/fridge/match')