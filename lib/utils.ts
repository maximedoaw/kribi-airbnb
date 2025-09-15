import { clsx, type ClassValue } from "clsx"
import { Timestamp } from "firebase/firestore";
import { twMerge } from "tailwind-merge"
import { Booking } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatFirestoreDate = (timestamp: any): string => {
  if (!timestamp) return 'Date inconnue';
  
  try {
    let date: Date;
    
    // Si c'est un objet Timestamp Firestore
    if (timestamp instanceof Timestamp) {
      date = timestamp.toDate();
    } 
    // Si c'est un objet avec seconds et nanoseconds
    else if (timestamp.seconds !== undefined && timestamp.nanoseconds !== undefined) {
      date = new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
    }
    // Si c'est déjà un objet Date
    else if (timestamp instanceof Date) {
      date = timestamp;
    }
    // Si c'est un string ou number
    else {
      date = new Date(timestamp);
    }
    
    // Vérifier que la date est valide
    if (isNaN(date.getTime())) {
      return 'Date invalide';
    }
    
    // Formater en mois et année en français
    const months = [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];
    
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${month} ${year}`;
    
  } catch (error) {
    console.error('Erreur de formatage de date:', error);
    return 'Date invalide';
  }
};

/**
 * Vérifie si une valeur est un timestamp Firestore
 */
export const isFirestoreTimestamp = (value: any): boolean => {
  return (
    value instanceof Timestamp ||
    (typeof value === 'object' && 
     value !== null && 
     'seconds' in value && 
     'nanoseconds' in value)
  );
};

export const generateInvoice = async (booking: Booking) => {
  // Créer un élément HTML pour la facture
  const invoiceElement = document.createElement('div');
  invoiceElement.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  invoiceElement.style.maxWidth = '800px';
  invoiceElement.style.margin = '0 auto';
  invoiceElement.style.padding = '20px';
  invoiceElement.style.backgroundColor = 'white';
  invoiceElement.style.color = '#333';

  // Styles CSS pour une facture élégante
  const styles = `
    <style>
      .invoice-container {
        border: 2px solid #1e40af;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      }
      .invoice-header {
        background: linear-gradient(135deg, #1e40af, #3b82f6);
        color: white;
        padding: 30px;
        text-align: center;
      }
      .invoice-title {
        font-size: 28px;
        font-weight: bold;
        margin: 0;
      }
      .invoice-subtitle {
        font-size: 14px;
        opacity: 0.9;
        margin: 5px 0 0 0;
      }
      .invoice-content {
        padding: 30px;
      }
      .invoice-section {
        margin-bottom: 25px;
      }
      .invoice-section-title {
        font-size: 18px;
        font-weight: bold;
        color: #1e40af;
        margin-bottom: 15px;
        border-bottom: 2px solid #e5e7eb;
        padding-bottom: 8px;
      }
      .invoice-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        margin-bottom: 20px;
      }
      .invoice-info {
        background: #f8fafc;
        padding: 15px;
        border-radius: 8px;
        border-left: 4px solid #3b82f6;
      }
      .invoice-info-label {
        font-size: 12px;
        color: #64748b;
        font-weight: 600;
        margin-bottom: 5px;
      }
      .invoice-info-value {
        font-size: 14px;
        color: #1e293b;
        font-weight: 500;
      }
      .invoice-table {
        width: '100%';
        border-collapse: collapse;
        margin: 20px 0;
      }
      .invoice-table th {
        background: #1e40af;
        color: white;
        padding: 12px;
        text-align: left;
        font-weight: 600;
      }
      .invoice-table td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
      }
      .invoice-table tr:nth-child(even) {
        background: #f8fafc;
      }
      .invoice-total {
        background: #1e40af;
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: right;
        margin-top: 20px;
      }
      .invoice-total-label {
        font-size: 16px;
        margin-bottom: 5px;
      }
      .invoice-total-amount {
        font-size: 24px;
        font-weight: bold;
      }
      .invoice-footer {
        text-align: center;
        margin-top: 30px;
        padding: 20px;
        border-top: 1px solid #e5e7eb;
        color: #64748b;
        font-size: 12px;
      }
      .logo {
        font-size: 24px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .status-badge {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }
      .status-confirmed {
        background: #dcfce7;
        color: #166534;
      }
      .status-pending {
        background: #fef3c7;
        color: #92400e;
      }
      .status-cancelled {
        background: #fee2e2;
        color: #991b1b;
      }
    </style>
  `;

  // Formatage des dates
  const formatDate = (date: Date | Timestamp | string | undefined): string => {
    if (!date) return 'N/A';
    
    let dateObj: Date;
    
    if (date instanceof Date) {
      dateObj = date;
    } else if (date instanceof Timestamp) {
      dateObj = date.toDate();
    } else if (typeof date === 'string') {
      dateObj = new Date(date);
    } else {
      return 'N/A';
    }
    
    if (isNaN(dateObj.getTime())) {
      return 'Date invalide';
    }
    
    return dateObj.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // Calcul du prix total
  const calculateTotalPrice = (): number => {
    if (!booking.apartment?.price) return 0;
    const nights = booking.nights || calculateNights();
    return booking.apartment.price * nights;
  };

  const calculateNights = (): number => {
    if (!booking.startDate || !booking.endDate) return 0;
    
    // Conversion des dates
    let start: Date;
    let end: Date;
    
    // Gestion de startDate
    if (booking.startDate instanceof Date) {
      start = booking.startDate;
    } else if (booking.startDate instanceof Timestamp) {
      start = booking.startDate.toDate();
    } else if (typeof booking.startDate === 'string') {
      start = new Date(booking.startDate);
    } else {
      return 0;
    }
    
    // Gestion de endDate
    if (booking.endDate instanceof Date) {
      end = booking.endDate;
    } else if (booking.endDate instanceof Timestamp) {
      end = booking.endDate.toDate();
    } else if (typeof booking.endDate === 'string') {
      end = new Date(booking.endDate);
    } else {
      return 0;
    }
    
    // Vérifier que les dates sont valides
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const nights = booking.nights || calculateNights();
  const totalPrice = calculateTotalPrice();

  // Badge de statut
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return '<span class="status-badge status-confirmed">Confirmé</span>';
      case 'pending':
        return '<span class="status-badge status-pending">En attente</span>';
      case 'cancelled':
        return '<span class="status-badge status-cancelled">Annulé</span>';
      default:
        return '<span class="status-badge">Inconnu</span>';
    }
  };

  // Contenu HTML de la facture
  invoiceElement.innerHTML = `
    ${styles}
    <div class="invoice-container">
      <div class="invoice-header">
        <div class="logo">🏖️ LaRoseDor</div>
        <h1 class="invoice-title">FACTURE</h1>
        <p class="invoice-subtitle">Votre séjour de rêve au bord de l'océan</p>
      </div>

      <div class="invoice-content">
        <div class="invoice-grid">
          <div class="invoice-info">
            <div class="invoice-info-label">N° DE FACTURE</div>
            <div class="invoice-info-value">${booking.id}</div>
          </div>
          <div class="invoice-info">
            <div class="invoice-info-label">DATE D'ÉMISSION</div>
            <div class="invoice-info-value">${new Date().toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        <div class="invoice-section">
          <h3 class="invoice-section-title">Informations du client</h3>
          <div class="invoice-grid">
            <div class="invoice-info">
              <div class="invoice-info-label">NOM DU CLIENT</div>
              <div class="invoice-info-value">${booking.username}</div>
            </div>
            <div class="invoice-info">
              <div class="invoice-info-label">STATUT DE LA RÉSERVATION</div>
              <div class="invoice-info-value">${getStatusBadge(booking.status)}</div>
            </div>
          </div>
        </div>

        <div class="invoice-section">
          <h3 class="invoice-section-title">Détails de la réservation</h3>
          <div class="invoice-grid">
            <div class="invoice-info">
              <div class="invoice-info-label">APPARTEMENT</div>
              <div class="invoice-info-value">${booking.apartment?.title || 'N/A'}</div>
            </div>
            <div class="invoice-info">
              <div class="invoice-info-label">LOCALISATION</div>
              <div class="invoice-info-value">${booking.apartment?.location || 'N/A'}</div>
            </div>
            <div class="invoice-info">
              <div class="invoice-info-label">DATE D'ARRIVÉE</div>
              <div class="invoice-info-value">${formatDate(booking.startDate)}</div>
            </div>
            <div class="invoice-info">
              <div class="invoice-info-label">DATE DE DÉPART</div>
              <div class="invoice-info-value">${formatDate(booking.endDate)}</div>
            </div>
          </div>
        </div>

        <div class="invoice-section">
          <h3 class="invoice-section-title">Détails de paiement</h3>
          <table class="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Séjour à ${booking.apartment?.title || 'Appartement'}</td>
                <td>${nights} nuit(s)</td>
                <td>${booking.apartment?.price?.toLocaleString() || '0'} FCFA</td>
                <td>${(booking.apartment?.price || 0) * nights} FCFA</td>
              </tr>
            </tbody>
          </table>

          <div class="invoice-total">
            <div class="invoice-total-label">TOTAL À PAYER</div>
            <div class="invoice-total-amount">${totalPrice.toLocaleString()} FCFA</div>
          </div>
        </div>

        <div class="invoice-section">
          <h3 class="invoice-section-title">Informations supplémentaires</h3>
          <div class="invoice-info">
            <div class="invoice-info-label">CARACTÉRISTIQUES DE L'APPARTEMENT</div>
            <div class="invoice-info-value">
              ${booking.apartment?.bedrooms || 0} chambre(s), 
              ${booking.apartment?.bathrooms || 0} salle(s) de bain, 
              ${booking.apartment?.area || 0}m²
            </div>
          </div>
        </div>
      </div>

      <div class="invoice-footer">
        <p>LaRoseDor - Kribi, Cameroun</p>
        <p>Tél: +237 659032254 | Email: libertesarah7@gmail.com</p>
        <p>Merci pour votre confiance ! Nous espérons vous revoir bientôt.</p>
      </div>
    </div>
  `;

  // Ouvrir la facture dans une nouvelle fenêtre pour impression
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Veuillez autoriser les pop-ups pour générer la facture');
    return;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Facture ${booking.id}</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 20px;
            background: white;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          }
          @media print {
            body {
              padding: 0;
            }
            .invoice-container {
              box-shadow: none;
              border: none;
            }
          }
        </style>
      </head>
      <body>
        ${invoiceElement.innerHTML}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() {
              window.close();
            }, 1000);
          }
        </script>
      </body>
    </html>
  `);

  printWindow.document.close();
};


