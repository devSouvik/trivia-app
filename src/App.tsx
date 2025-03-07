import { useState, useCallback, useEffect } from "react";
import triviaQuestions from "./data";

interface Player {
    id: number;
    name: string;
}

function App() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [playerNameInput, setPlayerNameInput] = useState<string>("");
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(
        null
    );
    const [showQuestion, setShowQuestion] = useState<boolean>(false);
    const [remainingPlayers, setRemainingPlayers] = useState<Player[]>([]);
    const [completedPlayers, setCompletedPlayers] = useState<Player[]>([]);

    const [remainingQuestions, setRemainingQuestions] = useState<string[]>([
        ...triviaQuestions,
    ]);

    useEffect(() => {
        setRemainingPlayers([...players]);
    }, [players]);

    const getRandomIndex = (array: unknown[]): number =>
        Math.floor(Math.random() * array.length);

    const getRandomPlayer = useCallback((): Player | null => {
        if (remainingPlayers.length === 0) return null;
        const index = getRandomIndex(remainingPlayers);
        const player = remainingPlayers[index];
        setRemainingPlayers((prev) => prev.filter((_, i) => i !== index));
        setCompletedPlayers((prev) => [...prev, player]);
        return player;
    }, [remainingPlayers]);

    const getRandomQuestion = useCallback((): string | null => {
        if (remainingQuestions.length === 0) {
            setRemainingQuestions([...triviaQuestions]);
        }
        const index = getRandomIndex(remainingQuestions);
        const question = remainingQuestions[index];
        setRemainingQuestions((prev) => prev.filter((_, i) => i !== index));
        return question;
    }, [remainingQuestions]);

    const handleStartSpin = useCallback(() => {
        if (remainingPlayers.length === 0) {
            alert("All players have played! Starting a new round...");
            setRemainingPlayers([...players]);
            setCompletedPlayers([]);
            setRemainingQuestions([...triviaQuestions]);
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
    }, [getRandomPlayer, getRandomQuestion, players, remainingPlayers]);

    const handleAddUser = useCallback(() => {
        const newPlayers = playerNameInput
            .split(",")
            .map((name) => name.trim())
            .filter((name) => name !== "");

        if (newPlayers.length === 0) {
            alert("Please enter at least one valid player name.");
            return;
        }

        // Check for duplicate names
        const duplicateNames = newPlayers.filter((name) =>
            players.some(
                (player) => player.name.toLowerCase() === name.toLowerCase()
            )
        );

        if (duplicateNames.length > 0) {
            alert(
                `The following names are already taken: ${duplicateNames.join(
                    ", "
                )}`
            );
            return;
        }

        // Add new players with unique IDs
        const newPlayersWithIds = newPlayers.map((name, index) => ({
            id: players.length + index + 1, // Generate unique ID
            name,
        }));

        setPlayers((prev) => [...prev, ...newPlayersWithIds]);
        setPlayerNameInput("");
    }, [playerNameInput, players]);

    const handlePlayerInputChange: React.ChangeEventHandler<HTMLInputElement> =
        useCallback((e) => {
            setPlayerNameInput(e.target.value);
        }, []);

    const handleInputKeyPress: React.KeyboardEventHandler<HTMLInputElement> =
        useCallback(
            (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddUser();
                }
            },
            [handleAddUser]
        );

    return (
        <div
            style={{
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                maxWidth: "800px",
                margin: "0 auto",
                padding: "2rem",
                minHeight: "100vh",
                backgroundColor: "#fafafa",
            }}
        >
            <h1 style={{ fontFamily: "Moderat, Helvetica, sans-serif" }}>
                Fun Friday - spartannash team @Cognizant
            </h1>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
                <input
                    value={playerNameInput}
                    type="text"
                    placeholder="Add players (comma-separated)"
                    onChange={handlePlayerInputChange}
                    onKeyDown={handleInputKeyPress}
                    style={{
                        flex: 1,
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0",
                        fontSize: "1rem",
                        outline: "none",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        transition: "all 0.2s",
                    }}
                />
                <button
                    onClick={handleAddUser}
                    style={{
                        padding: "0.75rem 1.5rem",
                        borderRadius: "8px",
                        background: "#6366f1",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                        transition: "all 0.2s",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                    }}
                >
                    Add Players
                </button>
            </div>

            {players.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                    <h2
                        style={{
                            fontSize: "1.125rem",
                            fontWeight: "500",
                            color: "#374151",
                            marginBottom: "1rem",
                        }}
                    >
                        Players ({remainingPlayers.length} remaining)
                    </h2>
                    <div
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                        }}
                    >
                        {players.map((player) => (
                            <div
                                key={player.id}
                                style={{
                                    padding: "0.375rem 0.75rem",
                                    borderRadius: "20px",
                                    background: completedPlayers.some(
                                        (p) => p.id === player.id
                                    )
                                        ? "#d1d5db"
                                        : "#e0e7ff",
                                    color: completedPlayers.some(
                                        (p) => p.id === player.id
                                    )
                                        ? "#6b7280"
                                        : "#3730a3",
                                    fontSize: "0.875rem",
                                    fontWeight: "500",
                                    transition: "all 0.2s",
                                    textDecoration: completedPlayers.some(
                                        (p) => p.id === player.id
                                    )
                                        ? "line-through"
                                        : "none",
                                    opacity: completedPlayers.some(
                                        (p) => p.id === player.id
                                    )
                                        ? 0.75
                                        : 1,
                                }}
                            >
                                {player.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={handleStartSpin}
                disabled={players.length === 0}
                style={{
                    width: "100%",
                    padding: "1rem",
                    borderRadius: "12px",
                    background: players.length > 0 ? "#6366f1" : "#d1d5db",
                    color: "white",
                    border: "none",
                    cursor: players.length > 0 ? "pointer" : "not-allowed",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "all 0.2s",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    marginBottom: "2rem",
                }}
            >
                {players.length > 0 ? "Spin the Wheel" : "Add players to start"}
            </button>

            {selectedPlayer && (
                <div
                    style={{
                        padding: "2rem",
                        background: "white",
                        borderRadius: "16px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        border: "1px solid #f3f4f6",
                    }}
                >
                    <div style={{ marginBottom: "1.5rem" }}>
                        <p
                            style={{
                                color: "#6b7280",
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Selected Player
                        </p>
                        <h2
                            style={{
                                fontSize: "1.5rem",
                                fontWeight: "600",
                                color: "#1f2937",
                            }}
                        >
                            {selectedPlayer.name}
                        </h2>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <p
                            style={{
                                color: "#6b7280",
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                            }}
                        >
                            Question
                        </p>
                        <div
                            style={{
                                padding: "1.5rem",
                                background: showQuestion
                                    ? "#f8fafc"
                                    : "#f1f5f9",
                                borderRadius: "8px",
                                minHeight: "100px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "all 0.2s",
                                filter: showQuestion ? "none" : "blur(8px)",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: "1.125rem",
                                    color: showQuestion ? "#1e293b" : "#64748b",
                                    margin: 0,
                                    textAlign: "center",
                                }}
                            >
                                {selectedQuestion}
                            </p>
                        </div>
                    </div>

                    {!showQuestion && (
                        <button
                            onClick={() => setShowQuestion(true)}
                            style={{
                                width: "100%",
                                padding: "0.75rem",
                                borderRadius: "8px",
                                background: "#f1f5f9",
                                color: "#64748b",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "500",
                                transition: "all 0.2s",
                            }}
                        >
                            Reveal Question
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
