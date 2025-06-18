import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRounds, createRound, getStatusName } from '../api';
import { useAuth } from '../context/AuthContext';
import './Rounds.css';

export default function Rounds() {
  const [rounds, setRounds] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [startInput, setStartInput] = useState('');
  const [startError, setStartError] = useState('');
  const { state: { username }, dispatch } = useAuth();
  
  useEffect(() => {
    setIsAdmin(username === 'admin');
  }, [username]);

  useEffect(() => {
    getRounds().then(setRounds)
  }, []);

  return (
    <div className="rounds-page">
      <div className="rounds-header" onClick={() => setShowOverlay(false)}>
        <span>Список раундов</span>
        <span>{username}</span>
      </div>

      {isAdmin && (
        <div className="rounds-controls">
          <button className="create-round-button" onClick={() => {
            setShowOverlay(true)
            if (!startInput) {
              const now = new Date();
              now.setMinutes(now.getMinutes() + 5);
              now.setSeconds(0);
              now.setMilliseconds(0);

              // преобразуем в локальное ISO для input[type="datetime-local"]
              const tzOffset = now.getTimezoneOffset() * 60000;
              const localISO = new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
              setStartInput(localISO);
            }
          }}>
            Создать раунд
          </button>
        </div>
      )}

      <div className="rounds-list">
        {rounds.map((round) => (
          <div key={round.id} className="round-box">
            <p><b>•</b> Round ID: <Link to={`/rounds/${round.id}`}>{round.id}</Link></p>
            <p>Start: {new Date(round.startAt).toLocaleString()}</p>
            <p>End: {new Date(round.endAt).toLocaleString()}</p>
            <p>Статус: {getStatusName(round.status)}</p>
            <hr />
          </div>
        ))}
      </div>
      {showOverlay && (
        <div className="overlay" onClick={() => setShowOverlay(false)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowOverlay(false)}>×</button>
            <label>Дата и время начала:</label>
            <input
              type="datetime-local"
              value={startInput}
              onChange={(e) => setStartInput(e.target.value)}
              className={startError ? 'error' : ''}
            />
            {startError && <div className="error-text">{startError}</div>}

            <button
              className="submit-button"
              onClick={async () => {
                setStartError('');
                try {
                  const startAt = new Date(startInput);
                  if (isNaN(startAt.getTime())) {
                    setStartError('Неверная дата');
                    return;
                  }

                  await createRound({ startAt: startAt.toISOString() });
                  setShowOverlay(false);
                  setStartInput('');
                  const updated = await getRounds();
                  setRounds(updated);
                } catch (e) {
                  setStartError('Ошибка при создании раунда');
                }
              }}
            >
              Отправить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

