import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);
  const [score1, setScore1] = useState(0); // Placar do jogador 1
  const [score2, setScore2] = useState(0); // Placar do jogador 2
  const [gameRunning, setGameRunning] = useState(true); // Controle do estado do jogo

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Configurações iniciais
    const width = canvas.width;
    const height = canvas.height;
    const paddleWidth = 10;
    const paddleHeight = 80;
    const ballSize = 10;

    let paddle1Y = height / 2 - paddleHeight / 2;
    let paddle2Y = height / 2 - paddleHeight / 2;
    let ballX = width / 2 - ballSize / 2;
    let ballY = height / 2 - ballSize / 2;
    let ballSpeedX = 4;
    let ballSpeedY = 4;

    const paddleSpeed = 6;
    let paddle1Velocity = 0;
    let paddle2Velocity = 0;

    // Desenhar elementos no canvas
    function draw() {
      context.clearRect(0, 0, width, height);

      // Fundo (azul escuro)
      context.fillStyle = '#001f3f';
      context.fillRect(0, 0, width, height);

      // Barras
      context.fillStyle = '#ff4d6d'; // Barra do jogador 1
      context.fillRect(10, paddle1Y, paddleWidth, paddleHeight);
      context.fillStyle = '#00d1ff'; // Barra do jogador 2
      context.fillRect(width - 20, paddle2Y, paddleWidth, paddleHeight);

      // Bola (branca)
      context.fillStyle = '#ffffff';
      context.fillRect(ballX, ballY, ballSize, ballSize);

      // Linha central
      context.setLineDash([5, 5]);
      context.strokeStyle = '#ffffff'; // Branco
      context.beginPath();
      context.moveTo(width / 2, 0);
      context.lineTo(width / 2, height);
      context.stroke();
    }

    // Atualizar posições
    function update() {
      // Movimento das barras
      paddle1Y = Math.max(0, Math.min(height - paddleHeight, paddle1Y + paddle1Velocity));
      paddle2Y = Math.max(0, Math.min(height - paddleHeight, paddle2Velocity + paddle2Y));

      // Movimento da bola
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      // Rebate na parte superior e inferior
      if (ballY <= 0 || ballY + ballSize >= height) {
        ballSpeedY = -ballSpeedY;
      }

      // Rebate nas barras
      if (
        ballX <= 20 &&
        ballY + ballSize > paddle1Y &&
        ballY < paddle1Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
      }

      if (
        ballX + ballSize >= width - 20 &&
        ballY + ballSize > paddle2Y &&
        ballY < paddle2Y + paddleHeight
      ) {
        ballSpeedX = -ballSpeedX;
      }

      // Verificar se a bola saiu do campo
      if (ballX <= 0) {
        setScore2((prev) => prev + 1); // Jogador 2 marca ponto
        resetBall();
      }

      if (ballX + ballSize >= width) {
        setScore1((prev) => prev + 1); // Jogador 1 marca ponto
        resetBall();
      }
    }

    // Reiniciar a posição da bola após marcar ponto
    function resetBall() {
      ballX = width / 2 - ballSize / 2;
      ballY = height / 2 - ballSize / 2;
      ballSpeedX = -ballSpeedX; // Inverter direção da bola
    }

    // Controle das barras
    function handleKeyDown(e) {
      switch (e.key) {
        case 'w':
          paddle1Velocity = -paddleSpeed;
          break;
        case 's':
          paddle1Velocity = paddleSpeed;
          break;
        case 'ArrowUp':
          paddle2Velocity = -paddleSpeed;
          break;
        case 'ArrowDown':
          paddle2Velocity = paddleSpeed;
          break;
        default:
          break;
      }
    }

    function handleKeyUp(e) {
      switch (e.key) {
        case 'w':
        case 's':
          paddle1Velocity = 0;
          break;
        case 'ArrowUp':
        case 'ArrowDown':
          paddle2Velocity = 0;
          break;
        default:
          break;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Loop do jogo
    function gameLoop() {
      if (gameRunning) {
        update();
        draw();
        requestAnimationFrame(gameLoop);
      }
    }

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameRunning]);

  function resetGame() {
    setScore1(0);
    setScore2(0);
    setGameRunning(true);
  }

  return (
    <div className="App">
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: '#ffffff', fontSize: '24px', marginRight: '50px' }}>
          Jogador 1: {score1}
        </h2>
        <h2 style={{ color: '#ffffff', fontSize: '24px' }}>
          Jogador 2: {score2}
        </h2>
      </div>
      <button
        onClick={resetGame}
        style={{
          marginBottom: '20px',
          padding: '10px 20px',
          backgroundColor: '#ff4d6d',
          border: 'none',
          borderRadius: '5px',
          color: '#ffffff',
          fontSize: '16px',
          cursor: 'pointer',
        }}
      >
        Reiniciar
      </button>
      <canvas ref={canvasRef} width={800} height={400} />
    </div>
  );
}

export default App;
