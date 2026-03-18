// Service connexion

type LoginPayload = {
    email: string
    password: string
}

type LoginSuccessResponse = 
    | { access_token: string } 
    | { must_change_password: true; reset_token: string }

export async function login(payload: LoginPayload): Promise<LoginSuccessResponse> {
    const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })

    if (!response.ok) {
        let message = 'Une erreur est survenue lors de la connexion.'

        try {
            const errorData = await response.json()
            if (typeof errorData.message === 'string') {
                message = errorData.message
            }
        } catch {

        }

        throw new Error(message)
    }
    
    return response.json() as Promise<LoginSuccessResponse>
}