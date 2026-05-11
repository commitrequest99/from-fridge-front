import { useState, useEffect } from 'react'
import { matchRecipes } from '../api/fridge'
import { addFavorite } from '../api/favorites'
import { getRecipeDetails } from '../api/recipes'
import './RecipesPage.css'

export default function RecipesPage() {
  const [data, setData] = useState({ canCookNow: [], needToBuy: [] })
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    matchRecipes()
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  const openRecipe = async (recipe) => {
    setSelected(recipe)
    try {
      const res = await getRecipeDetails(recipe.title)
      setDetail(res.data)
    } catch {
      setDetail(null)
    }
  }

  const closeModal = () => { setSelected(null); setDetail(null) }

  const handleFavorite = async (e, recipeId) => {
    e.stopPropagation()
    try {
      await addFavorite(recipeId)
      e.target.style.color = '#e53935'
    } catch {}
  }

  if (loading) return <div className="recipes-loading">Подбираем рецепты...</div>

  return (
    <div className="recipes-page">

      <section>
        <h2>Можно приготовить уже сейчас</h2>
        {data.canCookNow.length === 0
          ? <p className="empty-msg">Нет подходящих рецептов. Добавьте продукты в холодильник.</p>
          : (
            <div className="recipes-grid">
              {data.canCookNow.map(r => (
                <RecipeCard key={r.id} recipe={r} onOpen={openRecipe} onFavorite={handleFavorite} />
              ))}
            </div>
          )
        }
      </section>

      <section>
        <h2>Необходимо докупить продукты</h2>
        {data.needToBuy.length === 0
          ? <p className="empty-msg">Нет рецептов.</p>
          : (
            <div className="recipes-grid">
              {data.needToBuy.map(r => (
                <RecipeCard key={r.id} recipe={r} onOpen={openRecipe} onFavorite={handleFavorite} />
              ))}
            </div>
          )
        }
      </section>

      {selected && (
        <RecipeModal
          recipe={selected}
          detail={detail}
          onClose={closeModal}
        />
      )}
    </div>
  )
}

function RecipeCard({ recipe, onOpen, onFavorite }) {
  return (
    <div className="recipe-card" onClick={() => onOpen(recipe)}>
      <button className="favorite-btn" onClick={e => onFavorite(e, recipe.id)}>♥</button>
      <div className="recipe-card-placeholder">🍽️</div>
      <div className="recipe-card-info">
        <div className="recipe-card-title">{recipe.title}</div>
        <div className="recipe-card-meta">
          {recipe.cuisine && <span>{recipe.cuisine}</span>}
          {recipe.cookingTime && <span>· {recipe.cookingTime} мин</span>}
          {recipe.matchPercent < 100 && (
            <span className="match-pct">· {recipe.matchPercent}%</span>
          )}
        </div>
      </div>
    </div>
  )
}

function RecipeModal({ recipe, detail, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-placeholder">🍽️</div>
        <div className="modal-content">
          <h2>{recipe.title}</h2>
          <div className="modal-tags">
            {recipe.cuisine && <span className="tag">{recipe.cuisine}</span>}
            {recipe.cookingTime && <span className="tag">{recipe.cookingTime} мин</span>}
          </div>

          {detail ? (
            <>
              {detail.ingredients?.length > 0 && (
                <>
                  <h3>Ингредиенты:</h3>
                  <div className="modal-ingredients">
                    {detail.ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className={`ing-item ${recipe.missingIngredients?.includes(ing.name) ? 'missing' : 'have'}`}
                      >
                        {ing.name} — {ing.quantity}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {detail.instructions && (
                <>
                  <h3>Инструкция:</h3>
                  <ol className="modal-instructions">
                    {detail.instructions.split('.').filter(s => s.trim()).map((step, i) => (
                      <li key={i}>{step.trim()}.</li>
                    ))}
                  </ol>
                </>
              )}
            </>
          ) : (
            <p>Загрузка...</p>
          )}

          {recipe.missingIngredients?.length > 0 && (
            <div className="missing-block">
              <strong>Нужно докупить:</strong> {recipe.missingIngredients.join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}