import { useState, useCallback, useMemo, useEffect } from "react";

function App() {
    const [players, setPlayers] = useState<string[]>([]);
    const [playerNameInput, setPlayerNameInput] = useState<string>("");
    const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(
        null
    );
    const [showQuestion, setShowQuestion] = useState<boolean>(false);
    const [remainingPlayers, setRemainingPlayers] = useState<string[]>([]);
    const [completedPlayers, setCompletedPlayers] = useState<string[]>([]);

    const questionsArray = useMemo<string[]>(
        () => [
            "What is the capital of France?",
            "Who wrote 'To Kill a Mockingbird'?",
            "What is the square root of 64?",
            "Which planet is known as the Red Planet?",
            "Who painted the Mona Lisa?",
        ],
        []
    );

    const [remainingQuestions, setRemainingQuestions] = useState<string[]>([
        ...questionsArray,
    ]);

    useEffect(() => {
        setRemainingPlayers([...players]);
    }, [players]);

    const getRandomIndex = (array: string[]): number =>
        Math.floor(Math.random() * array.length);

    const getRandomPlayer = useCallback((): string | null => {
        if (remainingPlayers.length === 0) return null;
        const index = getRandomIndex(remainingPlayers);
        const player = remainingPlayers[index];
        setRemainingPlayers((prev) => prev.filter((_, i) => i !== index));
        setCompletedPlayers((prev) => [...prev, player]);
        return player;
    }, [remainingPlayers]);

    const getRandomQuestion = useCallback((): string | null => {
        if (remainingQuestions.length === 0) {
            setRemainingQuestions([...questionsArray]);
        }
        const index = getRandomIndex(remainingQuestions);
        const question = remainingQuestions[index];
        setRemainingQuestions((prev) => prev.filter((_, i) => i !== index));
        return question;
    }, [questionsArray, remainingQuestions]);

    const handleStartSpin = useCallback(() => {
        if (remainingPlayers.length === 0) {
            alert("All players have played! Starting a new round...");
            setRemainingPlayers([...players]);
            setCompletedPlayers([]);
            setRemainingQuestions([...questionsArray]);
            setSelectedPlayer(null);
            setSelectedQuestion(null);
            setShowQuestion(false);
        }

        setTimeout(() => {
            const player = getRandomPlayer();
            const question = getRandomQuestion();
            setSelectedPlayer(player);
            setSelectedQuestion(question);
            setShowQuestion(false);
        }, 100);
    }, [
        getRandomPlayer,
        getRandomQuestion,
        players,
        questionsArray,
        remainingPlayers,
    ]);

    const handleAddUser = useCallback<
        React.MouseEventHandler<HTMLButtonElement>
    >(() => {
        if (playerNameInput.trim() === "") {
            alert("Player name cannot be empty.");
            return;
        }

        setPlayers((prev) => [...prev, playerNameInput.trim()]);
        setPlayerNameInput("");
    }, [playerNameInput]);

    const handlePlayerInputChange: React.ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setPlayerNameInput(e.target.value);
        }, []);

    return (
        <div
            style={{
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                textAlign: "center",
                backgroundColor: "#f4f4f4",
                minHeight: "100vh",
            }}
        >
            <input
                value={playerNameInput}
                type="text"
                placeholder="Add player"
                onChange={handlePlayerInputChange}
                style={{
                    padding: "10px",
                    marginRight: "10px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                }}
            />
            <button
                onClick={handleAddUser}
                style={{
                    padding: "10px 15px",
                    borderRadius: "5px",
                    background: "#007BFF",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Add Player
            </button>

            <h2>Players:</h2>
            {players.map((player) => (
                <div
                    key={player}
                    style={{
                        textDecoration: completedPlayers.includes(player)
                            ? "line-through"
                            : "none",
                        marginBottom: "5px",
                    }}
                >
                    {player}
                </div>
            ))}

            <button
                onClick={handleStartSpin}
                disabled={players.length === 0}
                style={{
                    marginTop: "20px",
                    padding: "10px 15px",
                    borderRadius: "5px",
                    background: players.length > 0 ? "#28A745" : "#ccc",
                    color: "white",
                    border: "none",
                    cursor: players.length > 0 ? "pointer" : "default",
                }}
            >
                {players.length > 0 ? "Spin" : "Add players to start"}
            </button>

            {selectedPlayer && (
                <div
                    style={{
                        marginTop: "20px",
                        padding: "20px",
                        background: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                        maxWidth: "400px",
                        margin: "20px auto",
                    }}
                >
                    <h2>Selected Player: {selectedPlayer}</h2>
                    <div
                        style={{
                            position: "relative",
                            height: "50px",
                            marginTop: "10px",
                        }}
                    >
                        {showQuestion ? (
                            <h3>{selectedQuestion}</h3>
                        ) : (
                            <div
                                style={{
                                    height: "50px",
                                    background: "#ddd",
                                    borderRadius: "5px",
                                    filter: "blur(5px)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <h3 style={{ opacity: "0.5" }}>
                                    Hidden Question
                                </h3>
                            </div>
                        )}
                    </div>
                    {!showQuestion && (
                        <button
                            onClick={() => setShowQuestion(true)}
                            style={{
                                marginTop: "10px",
                                padding: "8px 12px",
                                borderRadius: "5px",
                                background: "#DC3545",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Show Question
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
