import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddUserPage() {
  return (
    <main className="flex justify-center items-start pt-12 md:pt-24 min-h-screen">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Add New Patient</CardTitle>
          <CardDescription>
            Enter the patient's details below to create a new account for them.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter patient's full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter patient's email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" type="tel" placeholder="Enter patient's phone number" />
            </div>
            <Button type="submit" className="w-full" disabled>
              Create Patient Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
