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
      <RecipeImage src={recipe.imageUrl} alt={recipe.title} className="recipe-card-img" />
      <div className="recipe-card-info">
        <div className="recipe-card-title">{recipe.title}</div>
        <div className="recipe-card-meta">
          {recipe.country && <span>{recipe.country}</span>}
          {recipe.category && <span>· {recipe.category}</span>}
          {recipe.matchPercent !== undefined && recipe.matchPercent < 100 && (
            <span className="match-pct">· {recipe.matchPercent}%</span>
          )}
        </div>
      </div>
    </div>
  )
}

function RecipeImage({ src, alt, className }) {
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className={`${className} recipe-placeholder`}>
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="70" height="70">
          {/* Тарелка */}
          <ellipse cx="50" cy="62" rx="35" ry="8" fill="#e0e0e0"/>
          <ellipse cx="50" cy="58" rx="35" ry="8" fill="#f5f5f5"/>
          {/* Еда на тарелке */}
          <ellipse cx="50" cy="55" rx="25" ry="6" fill="#a8d5b5"/>
          <circle cx="42" cy="52" r="5" fill="#2d8a4e"/>
          <circle cx="52" cy="51" r="6" fill="#4caf7d"/>
          <circle cx="60" cy="53" r="4" fill="#2d8a4e"/>
          {/* Вилка */}
          <rect x="18" y="30" width="2" height="22" rx="1" fill="#bbb"/>
          <rect x="16" y="28" width="1.5" height="8" rx="1" fill="#bbb"/>
          <rect x="18" y="28" width="1.5" height="8" rx="1" fill="#bbb"/>
          <rect x="20" y="28" width="1.5" height="8" rx="1" fill="#bbb"/>
          {/* Нож */}
          <rect x="78" y="30" width="2" height="22" rx="1" fill="#bbb"/>
          <path d="M78 28 Q82 32 80 38 L78 38 Z" fill="#bbb"/>
        </svg>
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} onError={() => setError(true)} />
}

function RecipeModal({ recipe, detail, onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <RecipeImage src={detail?.imageUrl || recipe.imageUrl} alt={recipe.title} className="modal-img" />
        <div className="modal-content">
          <h2>{recipe.title}</h2>
          <div className="modal-tags">
            {recipe.country && <span className="tag">{recipe.country}</span>}
            {recipe.category && <span className="tag">{recipe.category}</span>}
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
                        {ing.name}{ing.quantity ? ` — ${ing.quantity}` : ''}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {detail.instructions && (
                <>
                  <h3>Инструкция:</h3>
                  <ol className="modal-instructions">
                    {detail.instructions.split(/\\n|\n/).filter(s => s.trim()).map((step, i) => (
                      <li key={i}>{step.trim()}</li>
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