import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubsidiaryRequest } from "@/lib/types";
import React from "react";

/** 
{
    "name": "Barueri",
    "address": {
        "street": "Rua dos Bobos",
        "zipCode": "123",
        "city": "Osasco",
        "state": "São Paulo",
        "country": "Brasil"
    }
}
*/

export default function NewSubsidiary() {
  return (
    <div>
      Nova Filial
    </div>
  );

  const [subsidiary, setSubsidiary] = React.useState<SubsidiaryRequest>({
    name: "Exemplo",
    address: {
      street: "Rua",
      zipCode: "123",
      city: "Cidade",
      state: "Estado",
      country: "País"
    }
  })

  async function getCepInfo() {

  }

  return (
    <div className="p-4">
      <FormField text="Nome" />
      <FormField text="CEP" />
    </div>
  );
}

export function FormField({
  text,
  ...props
}: {
  text: string
} & React.ComponentProps<"input">) {
  return (
    <div className="flex items-center gap-4">
      <Label htmlFor={text}>{text}</Label>
      <Input
        id={text}
        {...props}
      />
    </div>
  );
}