import { useEffect, useState } from "react";
import { fetchPieceJointes, uploadPieceJointe } from "../services/PieceJointeService";
import type { PieceJointe } from "../services/PieceJointeService";

export default function usePiecesJointes(id_ticket: string | undefined) {
    const [piecesJointes, setPiecesJointes] = useState<PieceJointe[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!id_ticket) return
        fetchPieceJointes(id_ticket)
            .then(data => setPiecesJointes(data))
            .catch(err => setError(err.message))
    }, [id_ticket])

    const handleUpload = async (file: File) => {
        if (!id_ticket) return
        try {
            const nouvelle = await uploadPieceJointe(id_ticket, file)
            setPiecesJointes(prev => [...prev, nouvelle])
        } catch (err: any) {
            setError(err.message)
        }
    }

    return { piecesJointes, error, handleUpload }
}