import api from './axios'

export const getFavorites = () =>
  api.get('/favorites')

export const addFavorite = (recipeId) =>
  api.post(`/favorites/${recipeId}`)

export const removeFavorite = (recipeId) =>
  api.delete(`/favorites/${recipeId}`)