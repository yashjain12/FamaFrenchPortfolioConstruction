<img width="1837" height="523" alt="image" src="https://github.com/user-attachments/assets/31afee14-b0f1-4519-ba7a-4d7f508fee83" />

## test/famafrench.ipynb

This notebook serves as the **testing bed** for model comparison using the Fama-French 5-Factor framework.  
The goal is to evaluate different statistical approaches for estimating alpha (unexplained returns) and beta (factor exposures) before moving on to an **actual portfolio construction** phase.

### Model Setup
We use the following 5-Factor model, where returns are decomposed into market, size, value, profitability, and investment conservatism factors:

$$
R_{it} - R_{ft} = \\alpha_{it} + \\beta_1 (R_{mt} - R_{ft}) + \\beta_2 SML_t + \\beta_3 VMG_t + \\beta_4 RMW_t + \\beta_5 CMA_t + \\epsilon_t
$$

- $R_{it}$ : Return of portfolio *i* at time *t*  
- $R_{ft}$ : Risk-free rate at time *t*  
- $R_{mt}$ : Market portfolio return at time *t*  
- $SML_t$ : Size premium (small minus large)  
- $VMG_t$ : Value premium (value minus growth)  
- $RMW_t$ : Profitability premium  
- $CMA_t$ : Investment conservatism premium  
- $\\alpha_{it}$ : Excess return not explained by factors (“alpha”)  
- $\\beta_{1,...,5}$ : Factor exposures  

Data was obtained directly from **Kenneth French’s Data Library**.

---

### Models Tested
We implemented and compared three approaches:

1. **Linear + SVSS (Stochastic Variable Selection Smoother)**  
   - Captures static alpha and beta values.  
   - Provides a stable benchmark model.  
   - **Strength**: Simple, interpretable, and efficient baseline.  
   - **WAIC**: 291.5582.
   <img width="300" height="200" alt="image" src="https://github.com/user-attachments/assets/c4e067d7-11c2-4e7e-9dd9-81a2f389e71d" />

   <img width="300" height="150" alt="image" src="https://github.com/user-attachments/assets/4ab03ef3-622a-4cf2-93fb-ac635a923097" />


2. **Time-Varying Alpha + Beta Model**  
   - Allows alpha and beta to evolve over time.  
   - Tracks dynamic changes in exposures across market regimes.  
   - **Strength**: Adapts to shifting market conditions.  
   - **WAIC**: 281.66.
   
   <img width="350" height="140" alt="image" src="https://github.com/user-attachments/assets/84a3be26-3ef7-4d49-8fbd-806117f8ed8b" /> <img width="350" height="140" alt="image" src="https://github.com/user-attachments/assets/38f09027-c961-4ec2-8764-cae8c8e08f5c" /> 

   <img width="700" height="350" alt="image" src="https://github.com/user-attachments/assets/8fef8479-4665-40f1-8058-4799f956c806" />

3. **Time-Varying Alpha + Beta with Regime Effects**  
   - Adds latent “regimes” to capture market states (e.g., bull vs bear).  
   - Produces return predictions that **closely track actual realized returns**.  
   - **Strength**: Most realistic and flexible, balances fit with interpretability.  
   - **AIC/WAIC values**: 269.05.  
<img width="350" height="270" alt="image" src="https://github.com/user-attachments/assets/0a291f67-3c9a-4bd5-bf60-a181f5a58be0" /> <img width="320" height="250" alt="image" src="https://github.com/user-attachments/assets/3588db66-3840-4f51-8132-98f85abd3f0f" />

     <img width="700" height="350" alt="image" src="https://github.com/user-attachments/assets/89e341a0-9e5e-49b5-bb37-1150bd5f8251" />

### Why Optimize for Alpha?
While raw returns ($R_i - R_f$) can be maximized directly, they may be driven by **risk exposure** rather than true skill. For instance:  
- A portfolio heavily tilted toward risky assets might show high returns on some days, but also large drawdowns on others.  
- By focusing on **alpha**, we optimize for risk-adjusted return — isolating the part of performance not explained by systematic factors.  

This ensures that any predictive power is not merely the result of taking more risk, but from identifying genuine sources of excess return.

### Next Steps

Based on the results, we proceed with the **time-varying alpha and beta model with regime effects** for portfolio construction.  
This approach provided the **closest resemblance to realized portfolio returns**, making it the most promising candidate for generating **daily alpha signals** that will drive portfolio weight adjustments. Just look at this amazing fit!
<img width="750" height="375" alt="image" src="https://github.com/user-attachments/assets/37315d7e-13a3-4a99-bca5-ade520b07332" />

---
## src/AlphaSignal.ipynb
This repository implements a factor-based portfolio strategy with time-varying alpha, beta, and regime adjustments.

## Data

- **CRSP Daily**: open/high/low/close & volume → used to proxy trading costs (effective spread) and to get month-first open and month-end close for execution.
- **CRSP Monthly**: ETF returns (e.g., SPY/QQQ/IWM/EFA/TLT/EEM).
- **Fama-French factors (+UMD)**: Mkt-RF, SMB, HML, RMW, CMA, UMD and RF.
***
## Prep

- Align everything to month-end.
- Compute excess returns: $r_t(i) - RF_t$.
- Aggregate daily factors to monthly (proper compounding for returns; averages for rates if applicable).

## Factor model (alpha/beta)

- **Baseline**: rolling OLS on the 5-factor (+mom) model.
- **Enhanced**: time-varying $\\alpha$ and $\\beta$ (state-space style / random-walk $\\alpha$), optionally with regime dummies.

Output per asset $i$ each month $t$:
- $\\alpha_{i,t}$: abnormal return beyond risk-free and factors (i.e., the part a factor investor couldn’t explain).
- $\\beta_{i,t}^f$: exposure to factor $f$.

*Quick note*: alpha $\\neq$ risk-free. Alpha is the residual expected excess return after accounting for factors.

## Regimes

- Cluster monthly market states with K-means using:
  - Mkt (market excess return),
  - vol3 (3-month rolling std of Mkt),
  - mom3 (3-month sum of Mkt).

- Use regime labels to (i) include regime offsets in $\\alpha$, or (ii) down-weight “bad” regimes when mapping $\\alpha \\to$ weights.

## Signal: map alpha → target weights

- Score each asset: e.g., $s_{i,t} = \\max(0, \\alpha_{i,t} / SE[\\alpha_{i,t}])$ (long-only example).
- Normalize scores to weights with a per-asset cap (e.g., 35–50%) and simplex projection so weights sum to 1.

## Trade gate (cost-aware)

- Per-ticker cost (bps) from CRSP daily via Roll’s effective spread:

$$\\text{Roll spread} \\approx 2\\sqrt{-Cov(r_t, r_{t-1})}$$

$$\\text{per-side bps} \\approx \\tfrac{1}{2} \\cdot \\text{spread} \\times 10{,}000 + \\text{commission bps}$$

- Compute expected alpha gain from moving weights vs. turnover cost:

$$\\sum_i \\Delta w_{i,t}\\, \\alpha_{i,t} \\; >? \\; \\sum_i |\\Delta w_{i,t}| \\cdot cost_i \\; (\\text{in return units})$$

- Only trade when gain > cost (optionally add a small margin).

## Execution model

- Decide at $t$ close (no look-ahead).
- Rebalance at $t+1$ open, pay costs, hold to $t+1$ close.
- Record turnover, weights realized, PnL, portfolio $\\alpha_t$ and $\\beta_t$ (weight-averages).

## Outputs you’ll see

- Cumulative return (net of costs) and turnover time series.
- Weights over time per ETF (stacked or line plot).
- Portfolio alpha over time: $\\alpha_{p,t} = \\sum_i w_{i,t}\\, \\alpha_{i,t}$.
- Portfolio factor betas over time: $\\beta_{p,t}^f = \\sum_i w_{i,t}\\, \\beta_{i,t}^f$.
- Annualized stats: return, volatility, Sharpe; optional real (inflation-adjusted) return if CPI is added.

## “How do I run this?”

1. Download `DailyData.csv`, `monthlyData.csv`, `FactorData.csv` in `/src`.
2. Run the notebook/script:
   - Build alpha/beta per asset (rolling OLS / time-varying).
   - Cluster regimes (K-means on market features).
   - Map alpha → weights (with caps).
   - Trade at next open, gate by costs.
   - Plot results (cumulative return, weights, exposures).
