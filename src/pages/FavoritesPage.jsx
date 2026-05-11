import { useState, useEffect } from 'react'
import { getFavorites, removeFavorite } from '../api/favorites'
import { getRecipeDetails } from '../api/recipes'
import './FavoritesPage.css'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [detail, setDetail] = useState(null)

  useEffect(() => {
    getFavorites()
      .then(res => setFavorites(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (e, recipeId) => {
    e.stopPropagation()
    await removeFavorite(recipeId)
    setFavorites(favorites.filter(f => f.recipeId !== recipeId))
  }

  const openRecipe = async (fav) => {
    setSelected(fav)
    try {
      const res = await getRecipeDetails(fav.recipeTitle)
      setDetail(res.data)
    } catch {
      setDetail(null)
    }
  }

  const closeModal = () => { setSelected(null); setDetail(null) }

  if (loading) return <div className="fav-loading">Загрузка...</div>

  return (
    <div className="fav-page">
      <h1>Избранное</h1>

      {favorites.length === 0 ? (
        <div className="fav-empty">
          <div className="fav-empty-icon">♥</div>
          <p>У вас пока нет избранных рецептов</p>
          <p className="fav-empty-hint">Нажимайте ♥ на рецептах чтобы добавить их сюда</p>
        </div>
      ) : (
        <div className="fav-grid">
          {favorites.map(fav => (
            <div key={fav.id} className="fav-card" onClick={() => openRecipe(fav)}>
              <div className="fav-card-placeholder">🍽️</div>
              <div className="fav-card-info">
                <div className="fav-card-title">{fav.recipeTitle}</div>
                <div className="fav-card-date">
                  Добавлено {new Date(fav.addedAt).toLocaleDateString('ru-RU')}
                </div>
              </div>
              <button
                className="fav-remove-btn"
                onClick={e => handleRemove(e, fav.recipeId)}
                title="Удалить из избранного"
              >
                ♥
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-placeholder">🍽️</div>
            <div className="modal-content">
              <h2>{selected.recipeTitle}</h2>
              {detail ? (
                <>
                  <div className="modal-tags">
                    {detail.cuisine && <span className="tag">{detail.cuisine}</span>}
                    {detail.cookingTime && <span className="tag">{detail.cookingTime} мин</span>}
                  </div>
                  {detail.ingredients?.length > 0 && (
                    <>
                      <h3>Ингредиенты:</h3>
                      <div className="modal-ingredients">
                        {detail.ingredients.map((ing, i) => (
                          <span key={i} className="ing-item have">
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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}