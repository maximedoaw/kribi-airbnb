"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import { useBookings } from "@/hooks/use-bookings";
import { Booking, Apartment } from "@/types";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onPaymentSuccess: () => void;
  apartment: Apartment;
  startDate: Date;
  endDate: Date;
  nights: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  regex: RegExp;
  placeholder: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "orange",
    name: "Orange Money",
    image: "/orange.jpeg",
    regex: /^6(?:9|5[5-9])\d{7}$/,
    placeholder: "Ex: 695123456"
  },
  {
    id: "mtn",
    name: "MTN Mobile Money",
    image: "/mtn.jpg",
    regex: /^6(?:7|8|5[0-4])\d{7}$/,
    placeholder: "Ex: 675123456"
  }
];

export function PaymentModal({ 
  isOpen, 
  onClose, 
  amount, 
  onPaymentSuccess, 
  apartment, 
  startDate, 
  endDate, 
  nights 
}: PaymentModalProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { createBooking } = useBookings();

  const validatePhoneNumber = (number: string): boolean => {
    if (!selectedMethod) return false;
    
    const method = paymentMethods.find(m => m.id === selectedMethod);
    if (!method) return false;
    
    return method.regex.test(number);
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // N'autoriser que les chiffres
    setPhoneNumber(value);
    
    if (value && selectedMethod) {
      setIsValid(validatePhoneNumber(value));
    } else {
      setIsValid(null);
    }
  };

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId);
    
    if (phoneNumber) {
      const method = paymentMethods.find(m => m.id === methodId);
      setIsValid(method ? method.regex.test(phoneNumber) : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      // Créer la réservation après un paiement réussi
      await createBooking({
        apartmentId: apartment.id,
        startDate: startDate,
        endDate: endDate,
        status: 'pending',
        totalPrice: amount,
        nights: nights,
        apartment: apartment
      });
      
      // Appeler le callback de succès
      onPaymentSuccess();
      onClose();
      
      // Réinitialiser le formulaire
      setSelectedMethod("");
      setPhoneNumber("");
      setIsValid(null);
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
      alert("Une erreur s'est produite lors de la création de votre réservation.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200/50 shadow-xl">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            Paiement de {amount.toLocaleString()} FCFA
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            Veuillez sélectionner votre méthode de paiement et saisir votre numéro de téléphone.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Méthodes de paiement */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">Méthode de paiement</Label>
            <RadioGroup
              value={selectedMethod}
              onValueChange={handleMethodChange}
              className="grid grid-cols-2 gap-4"
            >
              {paymentMethods.map((method) => (
                <div key={method.id} className="relative">
                  <RadioGroupItem
                    value={method.id}
                    id={method.id}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={method.id}
                    className="flex flex-col items-center justify-center rounded-xl border-2 border-gray-200 bg-white p-4 hover:bg-gray-50 hover:border-blue-300 cursor-pointer transition-all duration-200 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50/50"
                  >
                    <div className="relative w-16 h-10 mb-2">
                      <Image
                        src={method.image}
                        alt={method.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {method.name}
                    </span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Numéro de téléphone */}
          <div className="space-y-3">
            <Label htmlFor="phone" className="text-base font-semibold">
              Numéro de téléphone
            </Label>
            <div className="relative">
              <Input
                id="phone"
                type="tel"
                placeholder={
                  selectedMethod 
                    ? paymentMethods.find(m => m.id === selectedMethod)?.placeholder
                    : "Sélectionnez d'abord une méthode"
                }
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                disabled={!selectedMethod}
                className="pr-10 text-lg py-6 border-2 focus:border-blue-500 transition-colors duration-200"
              />
              {isValid !== null && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  {isValid ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
            {isValid === false && (
              <p className="text-sm text-red-500">
                Numéro invalide pour {paymentMethods.find(m => m.id === selectedMethod)?.name}
              </p>
            )}
          </div>

          {/* Bouton de validation */}
          <Button
            type="submit"
            disabled={!isValid || isProcessing}
            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Traitement en cours...
              </div>
            ) : (
              `Payer ${amount.toLocaleString()} FCFA`
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}