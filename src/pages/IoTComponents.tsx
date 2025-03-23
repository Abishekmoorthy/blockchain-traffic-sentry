
import { 
  Cpu, 
  WifiIcon, 
  Database, 
  Layers, 
  Cloud, 
  ServerIcon,
  CircuitBoard,
  Lightbulb,
  ArrowRightLeft,
  Webcam,
  BarChart3,
  Radio
} from "lucide-react";
import HardwareItem, { HardwareCategory } from "@/components/iot/HardwareItem";
import ArchitectureLevel from "@/components/iot/ArchitectureLevel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const IoTComponents = () => {
  const hardwareComponents = [
    {
      name: "IR Sensor",
      description: "Infrared sensors for vehicle detection at traffic intersections",
      icon: BarChart3,
      category: "sensor" as HardwareCategory,
      specifications: [
        "Detection range: up to 5 meters",
        "Fast response time: < 10ms",
        "Digital output interface",
        "Used for vehicle counting"
      ],
      quantity: 2
    },
    {
      name: "ESP32-CAM",
      description: "Camera module for visual monitoring and verification of traffic flow",
      icon: Webcam,
      category: "sensor" as HardwareCategory,
      specifications: [
        "OV2640 2MP camera",
        "Built-in WiFi and Bluetooth",
        "MicroSD card slot",
        "Used for visual verification"
      ],
      quantity: 1
    },
    {
      name: "ESP32",
      description: "Microcontroller for edge processing and communication with sensors and actuators",
      icon: CircuitBoard,
      category: "controller" as HardwareCategory,
      specifications: [
        "Dual-core 32-bit CPU",
        "WiFi and Bluetooth connectivity",
        "4MB of flash memory",
        "Multiple GPIO pins"
      ],
      quantity: 1
    },
    {
      name: "Raspberry Pi",
      description: "Single-board computer for blockchain verification and local data processing",
      icon: Cpu,
      category: "controller" as HardwareCategory,
      specifications: [
        "Quad-core ARM Cortex-A72 CPU",
        "8GB RAM",
        "Runs lightweight blockchain node",
        "Handles security monitoring and alerts"
      ],
      quantity: 1
    },
    {
      name: "Servo Motor",
      description: "Actuator for controlling physical barriers or signals at traffic intersections",
      icon: ArrowRightLeft,
      category: "actuator" as HardwareCategory,
      specifications: [
        "180° rotation range",
        "Torque: 4.8V",
        "Angular velocity: 60°/0.1s",
        "Used for physical barrier control"
      ],
      quantity: 1
    },
    {
      name: "LED Traffic Lights",
      description: "Visual indicators for traffic control, showing red or green signals",
      icon: Lightbulb,
      category: "actuator" as HardwareCategory,
      specifications: [
        "High brightness LEDs",
        "Red and green indicators",
        "Low power consumption",
        "Controls traffic flow"
      ],
      quantity: 2
    },
    {
      name: "WiFi Module",
      description: "Provides wireless connectivity for data transmission to cloud and blockchain network",
      icon: WifiIcon,
      category: "communication" as HardwareCategory,
      specifications: [
        "IEEE 802.11 b/g/n",
        "2.4GHz operation",
        "WPA/WPA2 security",
        "Range: up to 100m"
      ],
      quantity: 1
    }
  ];

  const architectureLevels = [
    {
      title: "Perception Layer",
      description: "The foundation level where data collection from the physical world occurs through sensors",
      icon: BarChart3,
      color: "border-blue-500",
      components: hardwareComponents.filter(c => c.category === "sensor")
    },
    {
      title: "Network Layer",
      description: "Responsible for transmitting data between the perception layer and processing layers",
      icon: WifiIcon,
      color: "border-yellow-500",
      components: hardwareComponents.filter(c => c.category === "communication")
    },
    {
      title: "Processing Layer",
      description: "Handles data processing, decision making, and blockchain verification",
      icon: Cpu,
      color: "border-purple-500",
      components: hardwareComponents.filter(c => c.category === "controller")
    },
    {
      title: "Application Layer",
      description: "Provides user interfaces, monitoring dashboards, and control systems",
      icon: Layers,
      color: "border-indigo-500",
      content: "This dashboard application serves as the interface for monitoring and managing the IoT security system."
    },
    {
      title: "Actuation Layer",
      description: "Executes actions in the physical world based on decisions from the processing layer",
      icon: Lightbulb,
      color: "border-green-500",
      components: hardwareComponents.filter(c => c.category === "actuator")
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">IoT Components</h1>
        <p className="text-muted-foreground mt-2">
          Hardware components and architecture of the IoT security system for traffic management
        </p>
      </div>

      <Tabs defaultValue="components" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="components">Hardware Components</TabsTrigger>
          <TabsTrigger value="architecture">IoT Architecture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="components" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hardwareComponents.map((component, index) => (
              <HardwareItem 
                key={index}
                name={component.name}
                description={component.description}
                icon={component.icon}
                category={component.category}
                specifications={component.specifications}
                quantity={component.quantity}
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="architecture" className="mt-4 space-y-6">
          {architectureLevels.map((level, index) => (
            <ArchitectureLevel
              key={index}
              title={level.title}
              description={level.description}
              icon={level.icon}
              color={level.color}
            >
              {level.components ? (
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {level.components.map((component, i) => (
                    <div key={i} className="flex items-start p-3 rounded-md bg-background/60">
                      <div className="mr-3 mt-1">
                        <component.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{component.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{component.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm">{level.content}</p>
              )}
            </ArchitectureLevel>
          ))}
          
          <ArchitectureLevel
            title="Blockchain Security Layer"
            description="Ensures data integrity and security across the entire IoT ecosystem"
            icon={Database}
            color="border-primary"
          >
            <div className="mt-2 space-y-3">
              <div className="p-3 rounded-md bg-background/60">
                <h4 className="text-sm font-medium">Blockchain Verification</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Vehicle count data is stored in blockchain blocks to prevent tampering.
                  Each traffic signal decision is verified against the blockchain to ensure integrity.
                </p>
              </div>
              <div className="p-3 rounded-md bg-background/60">
                <h4 className="text-sm font-medium">Anomaly Detection</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  The system continuously monitors for discrepancies between sensor data and blockchain records.
                  Any attempt to manipulate traffic counts is detected by comparing real-time data with verified blockchain transactions.
                </p>
              </div>
            </div>
          </ArchitectureLevel>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IoTComponents;
