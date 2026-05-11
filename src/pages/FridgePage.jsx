import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getFridge, addToFridge, removeFromFridge } from '../api/fridge'
import { getAllIngredients } from '../api/ingredients'
import './FridgePage.css'

export default function FridgePage() {
  const [fridge, setFridge] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [search, setSearch] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getFridge().then(res => setFridge(res.data))
    getAllIngredients().then(res => setIngredients(res.data))

    const handleClick = () => setShowDropdown(false)
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const filtered = ingredients.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) &&
    !fridge.find(f => f.ingredientId === i.id)
  )

  const handleAdd = async (ingredient) => {
    await addToFridge(ingredient.id)
    setFridge([...fridge, { ingredientId: ingredient.id, ingredientName: ingredient.name }])
    setSearch('')
    setShowDropdown(false)
  }

  const handleRemove = async (ingredientId) => {
    await removeFromFridge(ingredientId)
    setFridge(fridge.filter(f => f.ingredientId !== ingredientId))
  }

  const freezer = fridge.slice(0, Math.ceil(fridge.length / 3))
  const main = fridge.slice(Math.ceil(fridge.length / 3))

  return (
    <div className="fridge-page">
      <div className="fridge-header">
        <h1>Мой холодильник</h1>
        <button className="find-btn" onClick={() => navigate('/recipes')}>
          🔍 Найти рецепты
        </button>
      </div>

      {/* Поиск и добавление продуктов */}
      <div className="add-product-bar" onClick={e => e.stopPropagation()}>
        <div className="add-product-input-wrap">
          <span className="add-icon">+</span>
          <input
            placeholder="Добавить продукт..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowDropdown(true) }}
            onFocus={() => setShowDropdown(true)}
          />
        </div>
        {showDropdown && search && (
          <div className="ingredient-dropdown">
            {filtered.length === 0
              ? <div className="dropdown-empty">Не найдено</div>
              : filtered.map(i => (
                <div key={i.id} className="dropdown-item" onClick={() => handleAdd(i)}>
                  {i.name}
                </div>
              ))
            }
          </div>
        )}
      </div>

      {/* Холодильник */}
      <div className="fridge-wrap">
        <div className="fridge-body">

          {/* Морозилка */}
          <div className="fridge-freezer">
            <div className="fridge-zone-label">❄️ Морозилка</div>
            <div className="fridge-handle" />
            <div className="zone-items">
              {freezer.length === 0
                ? <span className="zone-empty">Пусто</span>
                : freezer.map(item => (
                  <Tag key={item.ingredientId} item={item} onRemove={handleRemove} />
                ))
              }
            </div>
          </div>

          {/* Основной отдел */}
          <div className="fridge-main">
            <div className="fridge-handle" />
            <div className="fridge-main-inner">
              <div className="fridge-zone-label">🧊 Основной отдел</div>
              <div className="zone-items">
                {main.length === 0
                  ? <span className="zone-empty">Добавьте продукты выше</span>
                  : main.map(item => (
                    <Tag key={item.ingredientId} item={item} onRemove={handleRemove} />
                  ))
                }
              </div>
            </div>
          </div>

        </div>

        {fridge.length > 0 && (
          <div className="fridge-count">
            {fridge.length} продукт{fridge.length === 1 ? '' : fridge.length < 5 ? 'а' : 'ов'} в холодильнике
          </div>
        )}
      </div>
    </div>
  )
}

function Tag({ item, onRemove }) {
  return (
    <span className="fridge-tag">
      {item.ingredientName}
      <button onClick={() => onRemove(item.ingredientId)}>×</button>
    </span>
  )
}