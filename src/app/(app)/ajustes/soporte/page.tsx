import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SupportForm } from "@/components/support/support-form"

export default function SoportePage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 space-y-6 px-6 py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Soporte</h1>
        <p className="text-muted-foreground">
          ¿Algo no funciona o tienes una sugerencia? Cuéntanoslo.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Escríbenos</CardTitle>
          <CardDescription>Te respondemos lo antes posible.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupportForm />
        </CardContent>
      </Card>
    </div>
  )
}
