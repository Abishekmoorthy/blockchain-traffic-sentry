
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Blocks, CheckCircle2, Shield } from "lucide-react";

const SecurityFeatures = () => {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Blocks className="h-5 w-5 text-primary" />
          Blockchain Security Features
        </CardTitle>
        <CardDescription>
          How blockchain secures IoT data in traffic management
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-primary/20 rounded-full">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium">Immutable Ledger</h3>
              <p className="text-xs text-muted-foreground">
                Once data is recorded in the blockchain, it cannot be altered without consensus, preventing tampering with traffic counts.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-green-500/20 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-medium">Consensus Mechanism</h3>
              <p className="text-xs text-muted-foreground">
                Multiple nodes validate each transaction, ensuring that only legitimate traffic data is added to the blockchain.
              </p>
            </div>
          </div>
          
          <div className="p-4 bg-secondary/30 rounded-lg">
            <div className="flex flex-col items-center text-center gap-2">
              <div className="p-3 bg-blue-500/20 rounded-full">
                <Blocks className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-medium">Cryptographic Verification</h3>
              <p className="text-xs text-muted-foreground">
                Each block is cryptographically linked to previous blocks, making it impossible to modify historical traffic data.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityFeatures;
