import api from './axios'

export const addIngredient = (name) =>
  api.post('/admin/ingredients', { name })

export const deleteIngredient = (name) =>
  api.delete(`/admin/ingredients/${name}`)

export const addRecipe = (data) =>
  api.post('/admin/recipes', data)

export const archiveRecipe = (title) =>
  api.post(`/admin/recipes/${title}/archive`)

export const deleteRecipe = (title) =>
  api.delete(`/admin/recipes/${title}`)