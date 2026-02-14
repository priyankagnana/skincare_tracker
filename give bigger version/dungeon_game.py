import random
import json
import os

WIDTH = 10
HEIGHT = 10

# ---------- ENTITIES ----------

class Entity:
    def __init__(self, name, hp, attack):
        self.name = name
        self.hp = hp
        self.attack = attack

    def is_alive(self):
        return self.hp > 0


class Player(Entity):
    def __init__(self):
        super().__init__("Hero", 100, 15)
        self.x = 0
        self.y = 0
        self.inventory = []
        self.gold = 0
        self.level = 1
        self.xp = 0

    def gain_xp(self, amount):
        self.xp += amount
        if self.xp >= self.level * 50:
            self.level += 1
            self.hp += 20
            self.attack += 5
            print("⬆️ Level Up!", self.level)


class Enemy(Entity):
    def __init__(self, level):
        hp = random.randint(20, 40) + level * 5
        atk = random.randint(5, 12) + level
        super().__init__("Monster", hp, atk)
        self.x = random.randint(0, WIDTH-1)
        self.y = random.randint(0, HEIGHT-1)


# ---------- GAME ----------

class Game:
    def __init__(self):
        self.player = Player()
        self.enemies = []
        self.items = {}
        self.turn = 0
        self.spawn_enemies()
        self.spawn_items()

    def spawn_enemies(self):
        for _ in range(5):
            self.enemies.append(Enemy(self.player.level))

    def spawn_items(self):
        for _ in range(8):
            x = random.randint(0, WIDTH-1)
            y = random.randint(0, HEIGHT-1)
            self.items[(x, y)] = random.choice(["potion", "gold", "sword"])

    # ---------- MAP ----------

    def draw_map(self):
        for y in range(HEIGHT):
            row = ""
            for x in range(WIDTH):
                if self.player.x == x and self.player.y == y:
                    row += "P "
                elif any(e.x == x and e.y == y and e.is_alive() for e in self.enemies):
                    row += "E "
                elif (x, y) in self.items:
                    row += "I "
                else:
                    row += ". "
            print(row)

    # ---------- PLAYER ACTIONS ----------

    def move_player(self, dx, dy):
        nx = self.player.x + dx
        ny = self.player.y + dy

        if 0 <= nx < WIDTH and 0 <= ny < HEIGHT:
            self.player.x = nx
            self.player.y = ny
            self.check_tile()
        else:
            print("🚫 Wall!")

    def check_tile(self):
        # item
        if (self.player.x, self.player.y) in self.items:
            item = self.items.pop((self.player.x, self.player.y))
            self.collect_item(item)

        # enemy
        for e in self.enemies:
            if e.x == self.player.x and e.y == self.player.y and e.is_alive():
                self.combat(e)

    def collect_item(self, item):
        print("🎁 Found:", item)
        if item == "potion":
            self.player.inventory.append("potion")
        elif item == "gold":
            g = random.randint(10, 30)
            self.player.gold += g
            print("💰 Gold +", g)
        elif item == "sword":
            self.player.attack += 5
            print("⚔️ Attack increased!")

    # ---------- COMBAT ----------

    def combat(self, enemy):
        print("\n⚔️ Combat with Monster!")

        while enemy.is_alive() and self.player.is_alive():
            enemy.hp -= self.player.attack
            print("You hit:", self.player.attack)

            if enemy.is_alive():
                self.player.hp -= enemy.attack
                print("Monster hits:", enemy.attack)

        if self.player.is_alive():
            print("✅ Monster defeated!")
            self.player.gain_xp(25)
        else:
            print("💀 You died!")
            exit()

    # ---------- ENEMY AI ----------

    def move_enemies(self):
        for e in self.enemies:
            if not e.is_alive():
                continue
            dx = random.choice([-1, 0, 1])
            dy = random.choice([-1, 0, 1])
            e.x = max(0, min(WIDTH-1, e.x + dx))
            e.y = max(0, min(HEIGHT-1, e.y + dy))

    # ---------- INVENTORY ----------

    def use_potion(self):
        if "potion" in self.player.inventory:
            self.player.inventory.remove("potion")
            self.player.hp += 30
            print("🧪 Healed 30 HP")
        else:
            print("No potion!")

    # ---------- SAVE / LOAD ----------

    def save(self):
        data = {
            "player": self.player.__dict__,
            "enemies": [e.__dict__ for e in self.enemies],
            "items": {str(k): v for k, v in self.items.items()}
        }
        with open("save.json", "w") as f:
            json.dump(data, f)
        print("💾 Saved!")

    def load(self):
        if not os.path.exists("save.json"):
            print("No save file")
            return

        with open("save.json") as f:
            data = json.load(f)

        self.player.__dict__.update(data["player"])

        self.enemies = []
        for ed in data["enemies"]:
            e = Enemy(1)
            e.__dict__.update(ed)
            self.enemies.append(e)

        self.items = {}
        for k, v in data["items"].items():
            x, y = eval(k)
            self.items[(x, y)] = v

        print("📂 Loaded!")

    # ---------- UI ----------

    def status(self):
        p = self.player
        print(f"\nHP:{p.hp} ATK:{p.attack} LVL:{p.level} XP:{p.xp} GOLD:{p.gold}")
        print("Inventory:", p.inventory)

    # ---------- LOOP ----------

    def loop(self):
        while True:
            self.turn += 1
            print("\n--- Turn", self.turn, "---")
            self.draw_map()
            self.status()

            cmd = input("Move(w/a/s/d), use, save, load, quit: ").lower()

            if cmd == "w": self.move_player(0, -1)
            elif cmd == "s": self.move_player(0, 1)
            elif cmd == "a": self.move_player(-1, 0)
            elif cmd == "d": self.move_player(1, 0)
            elif cmd == "use": self.use_potion()
            elif cmd == "save": self.save()
            elif cmd == "load": self.load()
            elif cmd == "quit": break

            self.move_enemies()


# ---------- START ----------

if __name__ == "__main__":
    Game().loop()
