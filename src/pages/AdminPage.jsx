import { useState, useEffect } from 'react'
import { getAllIngredients } from '../api/ingredients'
import { getAllRecipes } from '../api/recipes'
import { addIngredient, deleteIngredient, addRecipe, deleteRecipe, archiveRecipe } from '../api/admin'
import './AdminPage.css'

export default function AdminPage() {
  const [ingredients, setIngredients] = useState([])
  const [recipes, setRecipes] = useState([])
  const [newIngredient, setNewIngredient] = useState('')
  const [recipe, setRecipe] = useState({
    title: '', category: '', country: '', instructions: '', ingredientsWithQuantity: ''
  })
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('ingredients')

  useEffect(() => {
    getAllIngredients().then(res => setIngredients(res.data))
    getAllRecipes().then(res => setRecipes(res.data))
  }, [])

  const handleAddIngredient = async () => {
    if (!newIngredient.trim()) return
    await addIngredient(newIngredient.trim())
    const res = await getAllIngredients()
    setIngredients(res.data)
    setNewIngredient('')
  }

  const handleDeleteIngredient = async (name) => {
    await deleteIngredient(name)
    setIngredients(ingredients.filter(i => i.name !== name))
  }

  const handleAddRecipe = async (e) => {
    e.preventDefault()
    await addRecipe({
      title: recipe.title,
      category: recipe.category,
      country: recipe.country,
      instructions: recipe.instructions,
      ingredientsWithQuantity: recipe.ingredientsWithQuantity
        .split('\n').map(s => s.trim()).filter(Boolean)
    })
    setMessage('Рецепт успешно добавлен!')
    setRecipe({ title: '', category: '', country: '', instructions: '', ingredientsWithQuantity: '' })
    const res = await getAllRecipes()
    setRecipes(res.data)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleArchiveRecipe = async (title) => {
    await archiveRecipe(title)
    setRecipes(recipes.map(r =>
      r.title === title ? { ...r, isArchived: true } : r
    ))
  }

  const handleDeleteRecipe = async (title) => {
    if (!confirm(`Удалить рецепт "${title}"?`)) return
    await deleteRecipe(title)
    setRecipes(recipes.filter(r => r.title !== title))
  }

  return (
    <div className="admin-page">
      <h1>Админ-панель</h1>

      {/* Табы */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          Ингредиенты ({ingredients.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          Рецепты ({recipes.length})
        </button>
        <button
          className={`admin-tab ${activeTab === 'add' ? 'active' : ''}`}
          onClick={() => setActiveTab('add')}
        >
          + Добавить рецепт
        </button>
      </div>

      {/* Ингредиенты */}
      {activeTab === 'ingredients' && (
        <div className="admin-section">
          <h2>Ингредиенты</h2>
          <div className="admin-add-row">
            <input
              placeholder="Название ингредиента"
              value={newIngredient}
              onChange={e => setNewIngredient(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddIngredient()}
            />
            <button onClick={handleAddIngredient}>Добавить</button>
          </div>
          <div className="ingredient-list">
            {ingredients.length === 0 && (
              <div className="empty-list">Ингредиентов пока нет</div>
            )}
            {ingredients.map(i => (
              <div key={i.id} className="ingredient-row">
                <span>{i.name}</span>
                <button className="del-btn" onClick={() => handleDeleteIngredient(i.name)}>
                  Удалить
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Рецепты */}
      {activeTab === 'recipes' && (
        <div className="admin-section">
          <h2>Рецепты</h2>
          <div className="ingredient-list">
            {recipes.length === 0 && (
              <div className="empty-list">Рецептов пока нет</div>
            )}
            {recipes.map(r => (
              <div key={r.id} className="ingredient-row">
                <div className="recipe-row-info">
                  <span className="recipe-row-title">{r.title}</span>
                  <div className="recipe-row-meta">
                    {r.country && <span>{r.country}</span>}
                    {r.category && <span>· {r.category}</span>}
                  </div>
                </div>
                <div className="recipe-row-actions">
                  {!r.isArchived && (
                    <button
                      className="del-btn archive-btn"
                      onClick={() => handleArchiveRecipe(r.title)}
                    >
                      Архивировать
                    </button>
                  )}
                  <button
                    className="del-btn"
                    onClick={() => handleDeleteRecipe(r.title)}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Добавить рецепт */}
      {activeTab === 'add' && (
        <div className="admin-section">
          <h2>Добавить рецепт</h2>
          {message && <div className="admin-msg">{message}</div>}
          <form onSubmit={handleAddRecipe} className="recipe-form">
            <input
              placeholder="Название *"
              value={recipe.title}
              onChange={e => setRecipe({ ...recipe, title: e.target.value })}
              required
            />
            <div className="form-row">
              <input
                placeholder="Категория (Курица, Десерт...)"
                value={recipe.category}
                onChange={e => setRecipe({ ...recipe, category: e.target.value })}
              />
              <input
                placeholder="Страна (Италия, Япония...)"
                value={recipe.country}
                onChange={e => setRecipe({ ...recipe, country: e.target.value })}
              />
            </div>
            <textarea
              placeholder="Инструкция *"
              value={recipe.instructions}
              onChange={e => setRecipe({ ...recipe, instructions: e.target.value })}
              required
              rows={4}
            />
            <textarea
              placeholder={"Ингредиенты (каждый с новой строки):\nМука, 200г\nМолоко, 500мл\nЯйца, 2 шт"}
              value={recipe.ingredientsWithQuantity}
              onChange={e => setRecipe({ ...recipe, ingredientsWithQuantity: e.target.value })}
              rows={6}
            />
            <button type="submit">Добавить рецепт</button>
          </form>
        </div>
      )}
    </div>
  )
}