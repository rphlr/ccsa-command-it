export const orderService = {
    sendOrder: async (orderData: OrderData): Promise<{ success: boolean; message: string }> => {
      try {
        // Récupérer le token d'authentification
        const token = localStorage.getItem('auth_token')
        
        // Envoyer la commande à l'API
        const response = await fetch('/api/send-order', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          },
          body: JSON.stringify(orderData),
        })
        
        const data = await response.json()
        
        if (!response.ok) throw new Error(data.error || 'Échec de l\'envoi de la commande')
        
        return data
      } catch (error) {
        if (error instanceof Error) {
          throw { error: error.message }
        }
        throw { error: 'Erreur lors de l\'envoi de la commande' }
      }
    }
  }