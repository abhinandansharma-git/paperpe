# Options Greeks Explained Simply - Delta, Theta, Vega, Gamma

*Updated: March 2026 | Reading time: 8 min*

**Options Greeks sound scary but they are essential.** This guide explains each Greek in simple terms with practical examples.

## What are Options Greeks?

Greeks measure how option prices change based on different factors:
- **Delta** - Price movement
- **Theta** - Time decay
- **Vega** - Volatility impact
- **Gamma** - Delta change rate

## Delta - The Direction Greek

**What it measures:** How much option price moves when underlying moves Rs 1

**Range:**
- Call options: 0 to +1
- Put options: 0 to -1

**Example:**
- NIFTY 22000 CE has Delta 0.50
- NIFTY moves up Rs 100
- Option moves up Rs 50 (100 x 0.50)

**Key insight:** ATM options have Delta ~0.50. Deep ITM ~1.0. Deep OTM ~0.0

## Theta - The Time Decay Greek

**What it measures:** How much value option loses per day

**Always negative for buyers** - Time works against you

**Example:**
- Option has Theta -5
- It loses Rs 5 per day from time decay
- Expiry week: Theta accelerates!

**Key insight:** Theta kills option buyers. Sell premium to earn theta.

## Vega - The Volatility Greek

**What it measures:** How much option price changes with 1% volatility change

**Example:**
- Option has Vega 10
- Volatility increases 1%
- Option price increases Rs 10

**Key insight:** Buy options before events (earnings, expiry). Sell after.

## Gamma - The Acceleration Greek

**What it measures:** How fast Delta changes

**Important for:** Scalpers, expiry day traders

**Example:**
- ATM option has high Gamma
- Small price move = big Delta change
- Explosive moves possible on expiry

**Key insight:** High Gamma = high risk and reward. Handle with care.

## Greeks Summary Table

| Greek | Measures | Buyer Impact | Seller Impact |
|-------|----------|--------------|---------------|
| Delta | Direction | +/- | -/+ |
| Theta | Time | Negative | Positive |
| Vega | Volatility | Positive | Negative |
| Gamma | Acceleration | High risk | High risk |

## Practical Tips

1. **Check Delta before entry** - Know your exposure
2. **Mind Theta on weekly options** - Time decay is brutal
3. **Use high Vega before events** - Buy before, sell after
4. **Respect Gamma on expiry** - Moves can be violent

## Practice with Greeks

[Paper trade options](/dashboard) - See Greeks in action without risk.

---

**Related:**
- [NIFTY Options Trading](/blog/nifty-options-trading)
- [BANKNIFTY Options Guide](/blog/banknifty-options)
