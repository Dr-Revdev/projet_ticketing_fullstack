import { useEffect, useState } from "react";
import type { SubmitEvent } from "react";
import { fetchUtilisateurs, createUtilisateur, /*updateUtilisateur,*/ deleteUtilisateur, fetchRoles, assignRole } from "../services/UtilisateurService";
import type { Utilisateur, Role } from "../services/UtilisateurService";
import { fetchEquipes } from "../services/EquipeService"
import type { Equipe } from "../services/EquipeService";

export default function useUtilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([])
    const [equipes, setEquipes] = useState<Equipe[]>([])
    const [roles, setRoles] = useState<Role[]>([])
    const [error, setError] = useState<string | null>(null)

    // Champs du formulaire
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [idEquipe, setIdEquipe] = useState('')
    const [idRole, setIdRole] = useState('')

    useEffect(() => {
        Promise.all([fetchUtilisateurs(), fetchEquipes(), fetchRoles()])
            .then(([u, e, r]) => { setUtilisateurs(u); setEquipes(e); setRoles(r) })
            .catch(err => setError(err.message))
    }, [])

    const handleCreate = async (e: SubmitEvent) => {
        e.preventDefault()
        setError(null)

        try {
            const nouveau = await createUtilisateur({ nom, prenom, email, password, id_equipe: idEquipe})

            if (idRole) {
                await assignRole(nouveau.id_utilisateur, idRole)
            }

            // Re-fetch pour inclure les rôles
            const updated = await fetchUtilisateurs()
            setUtilisateurs(updated)

            setNom(''); setPrenom(''); setEmail(''); setPassword(''); setIdEquipe(''); setIdRole('')
        } catch (err: any) {
            setError(err.message)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await deleteUtilisateur(id)
            setUtilisateurs(prev => prev.filter(u => u.id_utilisateur !== id))
        } catch (err: any) {
            setError(err.message)
        }
    }

    return {
        utilisateurs, equipes, roles, error,
        nom, setNom, prenom, setPrenom, email, setEmail, password, 
        setPassword, idEquipe, setIdEquipe, idRole, setIdRole,
        handleCreate, handleDelete,
    }
}