import { useEffect, useState } from 'react';
import './Round.css';
import guss from '../assets/guss.png';
import gussTapped from '../assets/guss_tapped.png';
import { useParams, Link } from 'react-router-dom';
import { getRound, tapRound } from '../api';
import { useAuth } from '../context/AuthContext';

const GUSS_TAPPED_TIME_MS = 100;
const END_ROUND_DELAY_MS = 500;
const ROUND_REFRESH_TIMEOUT_MS = 1000;

type RoundStatus = 'waiting' | 'cooldown' | 'active' | 'finished';

export default function Round() {
  const { roundId = '' } = useParams();
  const [round, setRound] = useState<any>(null);
  const [taps, setTaps] = useState(0);
  const [score, setScore] = useState(0);
  const [isTapped, setIsTapped] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [timeLeftToEnd, setTimeLeftToEnd] = useState('');


  const status = round?.status as RoundStatus || 'waiting';

  const { state: { username, roundTaps }, dispatch } = useAuth();

  useEffect(() => {
    if (roundId && roundTaps[roundId]) {
      setTaps(roundTaps[roundId]);
      setScore(getScoreFromTaps(roundTaps[roundId]));
    }
  }, [roundId, roundTaps]);

  useEffect(() => {
    if (!roundId) return;
    getRound(roundId).then(setRound);
  }, [roundId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (roundId) getRound(roundId).then(setRound);
    }, ROUND_REFRESH_TIMEOUT_MS);
    return () => clearInterval(interval);
  }, [roundId]);

  useEffect(() => {
    if (status === 'finished') {
      const timeout = setTimeout(() => fetchStats(), END_ROUND_DELAY_MS);
      return () => clearTimeout(timeout);
    }
  }, [status]);

  useEffect(() => {
    if (round?.status === 'finished') {
      fetchStats();
    }
  }, [round]);

  useEffect(() => {
    let interval: any;

    if (status === 'cooldown' && round?.startAt) {
      function updateTime() {
        const diff = new Date(round.startAt).getTime() - Date.now();
        if (diff <= 0) {
          setTimeLeft('0 сек.');
          return;
        }

        const sec = Math.floor(diff / 1000);
        const min = Math.floor(sec / 60);
        const remSec = sec % 60;

        setTimeLeft(`${min > 0 ? `${min} мин ` : ''}${remSec} сек.`);
      }

      updateTime();
      interval = setInterval(updateTime, 1000);
    }

    return () => clearInterval(interval);
  }, [status, round]);

  useEffect(() => {
    let interval: any;

    if (status === 'active' && round?.endAt) {
      function updateTime() {
        const diff = new Date(round.endAt).getTime() - Date.now();
        if (diff <= 0) {
          setTimeLeftToEnd('0 сек.');
          return;
        }

        const sec = Math.floor(diff / 1000);
        const min = Math.floor(sec / 60);
        const remSec = sec % 60;

        setTimeLeftToEnd(`${min > 0 ? `${min} мин ` : ''}${remSec} сек.`);
      }

      updateTime();
      interval = setInterval(updateTime, 1000);
    }

    return () => clearInterval(interval);
  }, [status, round]);

  function handleTap() {
    // animation
    setIsTapped(prev => prev + 1);
    setTimeout(() => setIsTapped(prev => prev - 1), GUSS_TAPPED_TIME_MS);

    if (status !== 'active') return;

    // POST tap
    tapRound(roundId);

    // local score
    const newTaps = taps + 1;
    setTaps(newTaps);
    setScore(getScoreFromTaps(newTaps));

    dispatch({ type: 'setTaps', roundId, taps: newTaps });
  }

  async function fetchStats() {
    const res = await fetch(`/api/rounds/${roundId}`, { credentials: 'include' });
    const data = await res.json();
    setStats({
      total: data.totalScore || 0,
      winner: data.topUser?.username || '',
      winnerScore: data.topUser?.score || 0,
      myScore: data.myScore || 0,
    });
  }

  return (
    <div className="round-frame">
      <div className="round-header">
        <span><Link to={`/rounds`}>К списку раундов</Link></span>
        <span>{username}</span>
      </div>
      <div className="goose-container">
        <img
          src={isTapped ? gussTapped : guss}
          alt="goose"
          className="goose-img"
          onClick={handleTap}
        />
      </div>
      <div className="info-block">
        {status === 'waiting' && round && (
          <table className="round-table">
            <tbody>
              <tr>
                <td><b>Раунд запланирован</b></td>
                <td className="value">{new Date(round.startAt).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        )}
        {status === 'cooldown' && (
          <table className="round-table">
            <tbody>
              <tr>
                <td><b>Cooldown</b></td>
                <td className="value">&nbsp;</td>
              </tr>
              <tr>
                <td><b>До начала раунда:</b></td>
                <td className="value">{timeLeft}</td>
              </tr>
            </tbody>
          </table>
        )}
        {status === 'active' && (
          <table className="round-table">
            <tbody>
              <tr>
                <td><b>Раунд активен</b></td>
                <td className="value">&nbsp;</td>
              </tr>
              <tr>
                <td><b>До конца осталось:</b></td>
                <td className="value">{timeLeftToEnd}</td>
              </tr>
              <tr>
                <td>Мои очки</td>
                <td className="value">{score}</td>
              </tr>
            </tbody>
          </table>
        )}
        {status === 'finished' && stats && (
          <table className="round-table">
            <tbody>
              <tr>
                <td><b>Раунд завершён</b></td>
                <td className="value">{new Date(round.endAt).toLocaleString()}</td>
              </tr>
              <tr>
                <td>Всего</td>
                <td className="value">{stats.total}</td>
              </tr>
              <tr>
                <td>Победитель: {stats.winner}</td>
                <td className="value">{stats.winnerScore}</td>
              </tr>
              <tr>
                <td>Мои очки</td>
                <td className="value">{stats.myScore}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );

}

function getScoreFromTaps(newTaps: number): number {
  return Math.floor(newTaps / 11) * 9 + newTaps;
}

