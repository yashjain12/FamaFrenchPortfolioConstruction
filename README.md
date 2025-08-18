## famafrench.ipynb

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

---

### Why Optimize for Alpha?
While raw returns ($R_i - R_f$) can be maximized directly, they may be driven by **risk exposure** rather than true skill. For instance:  
- A portfolio heavily tilted toward risky assets might show high returns on some days, but also large drawdowns on others.  
- By focusing on **alpha**, we optimize for risk-adjusted return — isolating the part of performance not explained by systematic factors.  

This ensures that any predictive power is not merely the result of taking more risk, but from identifying genuine sources of excess return.

---

### Next Steps
Based on the results, we proceed with the **time-varying alpha and beta model with regime effects** for portfolio construction.  
This approach provided the **closest resemblance to realized portfolio returns**, making it the most promising candidate for generating **daily alpha signals** that will drive portfolio weight adjustments. Just look at this amazing fit!
<img width="750" height="375" alt="image" src="https://github.com/user-attachments/assets/37315d7e-13a3-4a99-bca5-ade520b07332" />

