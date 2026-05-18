"use client";

import { useEffect, useRef } from "react";
export interface AIEmployee {
  role: string;
  status: string;
  progress: number;
}

interface PixelOfficeProps {
  employees: AIEmployee[];
}

export default function PixelOffice({ employees }: PixelOfficeProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  // Keep a ref to the latest employees state for the Phaser scene to access
  const employeesRef = useRef(employees);

  useEffect(() => {
    employeesRef.current = employees;
  }, [employees]);

  useEffect(() => {
    let isMounted = true;
    async function initPhaser() {
      const Phaser = await import("phaser");
      if (!isMounted) return; // Prevent double initialization in Strict Mode

      class OfficeScene extends Phaser.Scene {
        private empContainers: { [role: string]: Phaser.GameObjects.Container } = {};
        private empProgressBars: { [role: string]: Phaser.GameObjects.Rectangle } = {};

        constructor() {
          super("OfficeScene");
        }

        preload() {
          // Load spritesheets assuming 16x16 standard grid
          this.load.spritesheet('floor', '/assets/office/TopDownHouse_FloorsAndWalls.png', { frameWidth: 16, frameHeight: 16 });
          this.load.spritesheet('furniture', '/assets/office/TopDownHouse_FurnitureState1.png', { frameWidth: 16, frameHeight: 16 });
          this.load.spritesheet('characters', '/assets/office/spritesheet.png', { frameWidth: 16, frameHeight: 16 });
        }

        create() {
          const width = this.cameras.main.width;
          const height = this.cameras.main.height;
          const cx = width / 2;
          const cy = height / 2;

          this.add.rectangle(cx, cy, width, height, 0x111827); // Dark outer
          
          const roomW = 700;
          const roomH = 500;
          const left = cx - roomW/2;
          const top = cy - roomH/2;

          // 1. Draw Floor with Asset
          for (let x = left; x <= left + roomW; x += 32) {
            for (let y = top; y <= top + roomH; y += 32) {
              // Frame 0 or 1 is usually a floor tile
              this.add.sprite(x, y, 'floor', 1).setScale(2); 
            }
          }

          // Walls (fallback to shapes to keep the room contained since wall tiles are complex to auto-tile)
          const wallColor = 0x1f2937;
          this.add.rectangle(cx, top, roomW, 16, wallColor).setStrokeStyle(2, 0x000000); // Top
          this.add.rectangle(left, cy, 16, roomH, wallColor).setStrokeStyle(2, 0x000000); // Left
          this.add.rectangle(left + roomW, cy, 16, roomH, wallColor).setStrokeStyle(2, 0x000000); // Right
          this.add.rectangle(cx - 150, top + roomH, roomW/2 - 100, 16, wallColor).setStrokeStyle(2, 0x000000);
          this.add.rectangle(cx + 150, top + roomH, roomW/2 - 100, 16, wallColor).setStrokeStyle(2, 0x000000);
          
          // Entrance Mat
          this.add.rectangle(cx, top + roomH + 10, 120, 30, 0x4b5563);

          // 2. Manager Room (Top Left)
          this.add.rectangle(left + 150, top + 150, 300, 16, wallColor).setStrokeStyle(2, 0x000000); 
          this.add.rectangle(left + 220, top + 75, 16, 150, wallColor).setStrokeStyle(2, 0x000000); 
          this.add.text(left + 100, top + 30, "MANAGER OFFICE", { fontSize: '12px', color: '#ffffff', backgroundColor: '#000', padding: {x: 4, y: 2} });

          // 3. Meeting Area (Bottom Left)
          // Table from furniture asset (guessing index, 65 is a random guess, fallback to scaled)
          this.add.sprite(left + 120, top + 350, 'furniture', 45).setScale(4); 
          
          // 4. Employee Workstations (Open floor on the right)
          const deskConfig = [
            { role: "Manager", x: left + 100, y: top + 100, color: 0x4f46e5 }, 
            { role: "Researcher", x: cx + 100, y: top + 150, color: 0x0ea5e9 }, 
            { role: "Writer", x: cx + 220, y: top + 150, color: 0xd946ef }, 
            { role: "Designer", x: cx + 100, y: top + 300, color: 0xf43f5e }, 
            { role: "Reviewer", x: cx + 220, y: top + 300, color: 0x10b981 }, 
          ];

          deskConfig.forEach((desk, index) => {
            // Desk Asset
            this.add.sprite(desk.x, desk.y, 'furniture', 28).setScale(3); // Guessing a desk frame
            // Monitor Asset
            this.add.sprite(desk.x, desk.y - 15, 'furniture', 82).setScale(2); // Guessing a computer frame
            
            // Create Employee Container at Entrance
            const entranceX = cx;
            const entranceY = top + roomH - 20;
            const empContainer = this.add.container(entranceX, entranceY);

            // Character Asset
            // characters spritesheet is 288x64. (18 cols, 4 rows).
            // Different characters are usually on different rows or spaced out.
            // Let's use index * 18 for different characters (assuming 1 char per row)
            const personGroup = this.add.container(0, 0);
            const sprite = this.add.sprite(0, 0, 'characters', (index % 4) * 18).setScale(2);
            
            // Add a subtle color tint so we can tell them apart if the sprite is the same
            sprite.setTint(desk.color);

            personGroup.add([sprite]);

            // Label
            const label = this.add.text(0, -25, desk.role, {
              fontSize: "12px",
              fontFamily: "monospace",
              color: "#ffffff",
              backgroundColor: "#000000",
              padding: { x: 4, y: 2 }
            }).setOrigin(0.5);

            // Status
            const statusLabel = this.add.text(0, -40, "Waiting", {
              fontSize: "10px",
              fontFamily: "monospace",
              color: "#9ca3af",
            }).setOrigin(0.5);

            // Progress Bar Container (Hidden initially)
            const pbBg = this.add.rectangle(0, 25, 40, 6, 0x000000).setStrokeStyle(1, 0xffffff);
            const pbFill = this.add.rectangle(-19, 25, 0, 4, 0x34d399).setOrigin(0, 0.5);
            pbBg.setVisible(false);
            pbFill.setVisible(false);

            empContainer.add([personGroup, label, statusLabel, pbBg, pbFill]);
            
            // Store references
            this.empContainers[desk.role] = empContainer;
            this.empProgressBars[desk.role] = pbFill;

            empContainer.setData('deskX', desk.x);
            empContainer.setData('deskY', desk.y + 25); 
            empContainer.setData('statusLabel', statusLabel);
            empContainer.setData('pbBg', pbBg);
            empContainer.setData('personGroup', personGroup);
          });
        }

        update() {
          const currentEmployees = employeesRef.current;
          
          currentEmployees.forEach(emp => {
            const container = this.empContainers[emp.role];
            if (!container) return;

            const statusLabel = container.getData('statusLabel') as Phaser.GameObjects.Text;
            const pbBg = container.getData('pbBg') as Phaser.GameObjects.Rectangle;
            const pbFill = this.empProgressBars[emp.role];
            const personGroup = container.getData('personGroup') as Phaser.GameObjects.Container;
            
            // Safe check to avoid Cannot read property of undefined crashes
            if (!statusLabel || !pbBg || !pbFill || !personGroup) return;

            const currentStatus = statusLabel.text;

            // Only trigger state transitions if status changed
            if (currentStatus !== emp.status) {
              statusLabel.setText(emp.status);
              
              if (emp.status === "Walking") {
                statusLabel.setColor("#fbbf24");
                this.tweens.add({
                  targets: container,
                  x: container.getData('deskX'),
                  y: container.getData('deskY'),
                  duration: 2000,
                  ease: 'Sine.easeInOut'
                });
              } 
              else if (emp.status === "Planning" || emp.status === "Working") {
                statusLabel.setColor("#34d399");
                pbBg.setVisible(true);
                pbFill.setVisible(true);
                
                // Add bouncing animation if not already bouncing
                if (!this.tweens.getTweensOf(personGroup).length) {
                  this.tweens.add({
                    targets: personGroup,
                    scaleX: 1.05,
                    scaleY: 0.95,
                    y: 2,
                    duration: 400,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                  });
                }
              }
              else if (emp.status === "Done") {
                statusLabel.setColor("#10b981");
                pbBg.setVisible(false);
                pbFill.setVisible(false);
                this.tweens.killTweensOf(personGroup);
                personGroup.setScale(1);
                personGroup.setY(0);
              }
            }

            // Update Progress Bar Fill
            if (emp.status === "Planning" || emp.status === "Working") {
              const maxWidth = 38; // 40 width - 2 for border
              pbFill.width = (emp.progress / 100) * maxWidth;
            }
          });
        }
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
          parent: "phaser-container",
          width: 800,
          height: 600,
        },
        backgroundColor: "#000000",
        scene: OfficeScene,
        pixelArt: true,
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;
    }

    if (!gameRef.current && typeof window !== "undefined") {
      initPhaser();
    }

    return () => {
      isMounted = false;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div id="phaser-container" className="w-full h-full m-0 p-0 overflow-hidden bg-black rounded-xl border border-gray-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]"></div>
  );
}
