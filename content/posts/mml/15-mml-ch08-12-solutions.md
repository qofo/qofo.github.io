---
title: "MML 8~12장 연습문제 풀이: 답과 단계별 풀이"
slug: "mml-ch08-12-solutions"
date: 2026-10-15
weight: 15
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "머신러닝 수학", "연습문제", "선형회귀", "PCA", "GMM", "SVM"]
description: "MML 8~12장 연습문제 43개와 OX 퀴즈의 답과 단계별 풀이. 경험적 위험과 베이즈 팩터, 정규방정식과 베이즈 선형회귀, PCA와 확률적 PCA, GMM의 EM, SVM의 쌍대와 커널."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재:** Deisenroth·Faisal·Ong, *Mathematics for Machine Learning* ([mml-book.github.io](https://mml-book.github.io/)에 공개된 PDF, 2024-01-15 판). 쪽수와 식 번호는 그 PDF 기준이다.  
> **문제지:** [앞 편](14-mml-ch08-12-exercises.md)에 문제만 따로 모아 두었다. 먼저 문제지로 풀어 본 뒤 이 글로 맞춰 본다.  
> **검산:** 모든 숫자 답은 numpy·scipy로 다시 계산했다. 교재 예제 11.1~11.5의 값(평균 $-2.7,-0.4,3.7$, 분산 $0.14,0.44,1.53$, 비율 $0.29,0.29,0.42$, 로그 가능도 $-28.3\to-14.4$)도 같은 코드로 재현했다. 12-2와 12-5의 SVM 해는 scipy 최적화로 다시 풀어 같은 답을 얻었다. 교재 식 번호와 그림 8.11의 화살표는 PDF 원문과 대조했다.  
> **표기:** 교재와 같이 공분산의 분모는 $N$, 스칼라 함수의 기울기는 행벡터, $\log$는 자연로그다. 교재에 없는 내용은 **교재 밖 보충**이라고 표시했다.

| 장 | 문제 | 한 줄 요약 |
|---|---|---|
| [8 모델과 데이터](#8장-모델과-데이터) | 8-1 ~ 8-9 | 손실·가능도·사전분포·그래프·모델 선택 |
| [9 선형 회귀](#9장-선형-회귀) | 9-1 ~ 9-9 | 정규방정식, 릿지=MAP, 베이즈 회귀, 증거, 사영 |
| [10 PCA](#10장-pca) | 10-1 ~ 10-9 | 고유분해, 재구성 오차, SVD, $N<D$, 표준화, PPCA |
| [11 GMM과 EM](#11장-gmm과-em) | 11-1 ~ 11-8 | 책임도, 갱신식, EM 한 바퀴, 특이점 |
| [12 SVM](#12장-svm) | 12-1 ~ 12-8 | 마진, 쌍대, 힌지, 커널 |
| [OX 퀴즈](#ox-퀴즈-답) | 1 ~ 15 | |

---

## 8장 모델과 데이터

### 8-1. 경험적 위험과 과적합

**(a)** $f_2(x)=ax^2+bx+c$에 세 점을 넣는다.
- $x=0$: $c=0$
- $x=1$: $a+b=2$
- $x=2$: $4a+2b=2$

셋째 식에서 둘째 식의 두 배를 빼면 $2a=2-4=-2$, 즉 $a=-1$, $b=3$이다.

**답:** $f_2(x)=-x^2+3x$

**(b)** 경험적 위험 (8.6)은 손실의 평균 $R_{\text{emp}}=\frac1N\sum_n(y_n-\hat y_n)^2$이다.

| $x$ | $y$ | $f_1(x)$ | $(y-f_1)^2$ | $f_2(x)$ | $(y-f_2)^2$ |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 | 0 |
| 1 | 2 | 1 | 1 | 2 | 0 |
| 2 | 2 | 2 | 0 | 2 | 0 |

**답:** $R_{\text{emp}}(f_1)=\frac13\approx0.333$, $R_{\text{emp}}(f_2)=0$

**(c)** 테스트 점에서 계산한다. $f_2(3)=-9+9=0$, $f_2(4)=-16+12=-4$.

| $x$ | $y$ | $f_1(x)$ | $(y-f_1)^2$ | $f_2(x)$ | $(y-f_2)^2$ |
|---|---|---|---|---|---|
| 3 | 2.5 | 3 | 0.25 | 0 | 6.25 |
| 4 | 4.5 | 4 | 0.25 | $-4$ | 72.25 |

**답:** 테스트 위험 $f_1$: $0.25$, $f_2$: $\frac{6.25+72.25}2=39.25$

**(d)** 교재 8.2.3절은 훈련 데이터로 잰 위험 $R_{\text{emp}}(f,X_{\text{train}},y_{\text{train}})$이 기대 위험 $R_{\text{true}}(f)$를 크게 **과소평가**할 때를 과적합이라 하고, 기대 위험은 테스트 데이터의 경험적 위험으로 추정한다. $f_2$는 훈련 위험 0, 테스트 위험 39.25로 차이가 매우 크므로 과적합이다. 세 점에 매개변수 세 개짜리 함수를 맞추면 데이터를 "외워 버릴" 수 있다(교재: 충분히 풍부한 함수 집합이면 경험적 위험을 0으로 만들 수 있다). $f_1$은 훈련 0.333, 테스트 0.25로 차이가 없다.

---

### 8-2. 가우시안 가능도, 최소제곱, 정규화 최소제곱

**(a)** 가우시안 밀도는 $\mathcal N(y\mid m,\sigma^2)=\frac1{\sqrt{2\pi\sigma^2}}\exp\!\big(-\frac{(y-m)^2}{2\sigma^2}\big)$이다. 로그를 씌우고 부호를 바꾸면

$$
\begin{aligned}
&-\log\mathcal N(y_n\mid x_n^\top\theta,\sigma^2)\\
&=\frac{(y_n-x_n^\top\theta)^2}{2\sigma^2}+\frac12\log(2\pi\sigma^2).
\end{aligned}
$$

데이터가 독립이므로 (8.17)처럼 합하면

$$
\begin{aligned}
\mathcal L(\theta)&=\frac1{2\sigma^2}\sum_{n=1}^N(y_n-x_n^\top\theta)^2\\
&\quad+\frac N2\log(2\pi\sigma^2).
\end{aligned}
$$

이것이 (8.18d)다. 둘째 항은 $\theta$와 무관한 상수이고, 첫째 항은 양수 $\frac1{2\sigma^2}$에 제곱합을 곱한 것이다. 양수를 곱하거나 상수를 더해도 최소점은 그대로이므로

$$
\arg\min_\theta\mathcal L(\theta)=\arg\min_\theta\frac1N\|y-X\theta\|^2.
$$

이것이 최소제곱 문제 (8.9)다.

**(b)** 목적함수를 전개한다.

$$
\begin{aligned}
J(\theta)&=\tfrac1N\big(y^\top y-2y^\top X\theta\\
&\qquad+\theta^\top X^\top X\theta\big)+\lambda\theta^\top\theta.
\end{aligned}
$$

5장의 미분 규칙 $\frac{d}{d\theta}(a^\top\theta)=a^\top$, $\frac{d}{d\theta}(\theta^\top A\theta)=2\theta^\top A$ ($A$ 대칭)를 쓰면

$$
\begin{aligned}
\frac{dJ}{d\theta}&=\tfrac1N\big(-2y^\top X+2\theta^\top X^\top X\big)\\
&\quad+2\lambda\theta^\top.
\end{aligned}
$$

이를 $0^\top$으로 놓고 $\frac N2$를 곱하면 $\theta^\top X^\top X+N\lambda\theta^\top=y^\top X$, 전치하면 $(X^\top X+N\lambda I)\theta=X^\top y$다.

**답:** $\theta^*=(X^\top X+N\lambda I)^{-1}X^\top y$

헤시안 $\frac2NX^\top X+2\lambda I$가 $\lambda>0$이면 양의 정부호라서 $J$는 볼록이고, 이 정류점이 최소점이다.

**(c)** $X^\top X=1+4+9=14$, $X^\top y=2+6+15=23$, $N=3$.
- $\lambda=0$: $\theta=\frac{23}{14}\approx1.643$
- $\lambda=\frac13$: $N\lambda=1$이므로 $\theta=\frac{23}{14+1}=\frac{23}{15}\approx1.533$

정규화가 $\theta$를 0 쪽으로 줄였다.

**(d)** (9.32)를 $N$으로 나누면 $\frac1N\|y-\Phi\theta\|^2+\frac{\lambda_9}{N}\|\theta\|^2$이다. 따라서 $\lambda_8=\lambda_9/N$, 즉 $\lambda_9=N\lambda_8$이다. **9장의 $\lambda$는 8장 $\lambda$의 $N$배**다. (c)에서 $\lambda_9=1$이고, (9.34) $(\Phi^\top\Phi+\lambda_9I)^{-1}\Phi^\top y$도 $\frac{23}{15}$을 준다.

---

### 8-3. 동전 던지기: MLE, MAP, 베이즈 추론

앞면 수 $h=6$, 던진 수 $N=8$.

**(a)** $p(x\mid\mu)=\mu^x(1-\mu)^{1-x}$이고 독립이므로 $p(\mathcal X\mid\mu)=\mu^6(1-\mu)^2$이다(식 (8.33)).

$$
\mathcal L(\mu)=-6\log\mu-2\log(1-\mu).
$$

$$
\begin{aligned}
\frac{d\mathcal L}{d\mu}&=-\frac6\mu+\frac2{1-\mu}=0\\
&\Rightarrow\ 6(1-\mu)=2\mu\ \Rightarrow\ \mu=\frac68.
\end{aligned}
$$

2계 도함수 $\frac6{\mu^2}+\frac2{(1-\mu)^2}>0$이라 최소점이다.

**답:** $\mu_{\text{ML}}=\frac34=0.75$ ($\mathcal L(0.75)\approx4.499$)

**(b)** $\text{Beta}(2,2)$ 밀도는 $\mu(1-\mu)$에 비례한다. 음의 로그 사후분포는 상수를 빼고

$$
\begin{aligned}
&-\log p(\mu\mid\mathcal X)\\
&=-7\log\mu-3\log(1-\mu)+\text{const}.
\end{aligned}
$$

미분해서 0: $-\frac7\mu+\frac3{1-\mu}=0\Rightarrow7(1-\mu)=3\mu\Rightarrow\mu=\frac7{10}$.

**답:** $\mu_{\text{MAP}}=0.7$. 일반식은 $\frac{h+\alpha-1}{N+\alpha+\beta-2}$이다.

**(c)** 사후분포는 가능도×사전분포에 비례한다(8.20).

$$
\begin{aligned}
p(\mu\mid\mathcal X)&\propto\mu^6(1-\mu)^2\cdot\mu(1-\mu)\\
&=\mu^7(1-\mu)^3.
\end{aligned}
$$

**답:** $\text{Beta}(8,4)$ (일반식 $\text{Beta}(\alpha+h,\ \beta+N-h)$). 베타 사전분포가 베르누이 가능도의 켤레라서 사후분포도 베타다.

**(d)** (8.23)처럼 매개변수를 적분해서 없앤다.

$$
\begin{aligned}
p(x_*=1\mid\mathcal X)&=\int_0^1\mu\,p(\mu\mid\mathcal X)\,d\mu\\
&=\mathbb E[\mu\mid\mathcal X]=\frac{8}{8+4}.
\end{aligned}
$$

**답:** $\frac23\approx0.667$. ML 값 0.75, MAP 값 0.7보다 0.5 쪽에 가깝다.

- MAP 0.7은 사후분포 $\text{Beta}(8,4)$의 최빈값 $\frac{8-1}{8+4-2}$이고, 베이즈 예측 $\frac23$은 평균이다. 사후분포가 비대칭이라 둘이 다르다.
- 베이즈 예측은 "$\mu$가 0.75일 수도, 0.5일 수도 있다"는 불확실성을 평균에 반영한다. 데이터가 8개뿐이라 이 차이가 크다.
- 그림 8.10(c)는 바로 이 모델($\alpha,\beta$를 고정한 초사전분포를 $\mu$에 둔 그래프)이다.

---

### 8-4. 인수분해와 그래프

**(a)** 예제 8.7의 규칙: 조건부 분포 하나마다, 조건에 들어간 변수에서 그 변수로 화살표를 긋는다.
- $p(b\mid a)$: $a\to b$
- $p(c\mid a)$: $a\to c$
- $p(d\mid b,c)$: $b\to d$, $c\to d$

**답:** $a\to b$, $a\to c$, $b\to d$, $c\to d$ (마름모 모양)

**(b)** (8.31): 각 노드를 부모가 주어진 조건부 분포로 쓰고 모두 곱한다. 부모는 $x_1$: 없음, $x_2$: $x_1$, $x_3$: $x_1$, $x_4$: $x_2,x_3$, $x_5$: $x_4$.

**답:** $p(x_1,\dots,x_5)=p(x_1)\,p(x_2\mid x_1)\,p(x_3\mid x_1)\,p(x_4\mid x_2,x_3)\,p(x_5\mid x_4)$

**(c)** (**교재 밖 보충**)
- 표 하나: 경우의 수 $2^5=32$개의 확률, 합이 1이라는 제약 하나 → **31개**
- 인수분해: 이진 변수의 부모가 $k$개이면 부모 값 조합 $2^k$개마다 $p(x=1\mid\cdot)$ 하나가 필요하다. $x_1$: 1, $x_2$: 2, $x_3$: 2, $x_4$: 4, $x_5$: 2 → **11개**

그래프가 말해 주는 조건부 독립 덕분에 필요한 수가 크게 준다. 교재가 그래프 모델을 "간결한 표현"이라고 부르는 이유다.

---

### 8-5. d-분리 판정

**규칙(8.5.2절):** $A$의 노드에서 $B$의 노드로 가는 모든 경로(화살표 방향을 무시한 길)를 본다. 경로 위의 한 노드에서
1. 화살표가 **머리-꼬리**($\to\bullet\to$)나 **꼬리-꼬리**($\leftarrow\bullet\to$)로 만나고 그 노드가 조건 집합 $C$에 있으면, 경로가 막힌다.
2. 화살표가 **머리-머리**($\to\bullet\leftarrow$)로 만나고 그 노드도, 그 자손도 $C$에 없으면, 경로가 막힌다.

모든 경로가 막혀야 $A\perp\!\!\!\perp B\mid C$다. 경로 하나라도 열려 있으면 그래프만으로는 독립이 보장되지 않는다.

그림 8.11: $a\to b\to c$, $a\to d\leftarrow c$, $d\to e$. $d$의 자손은 $e$뿐이다.

**(a)**

- **(8.35) $b\perp\!\!\!\perp d\mid\{a,c\}$:** 경로 ① $b\leftarrow a\to d$: $a$에서 꼬리-꼬리, $a\in C$ → 막힘. 경로 ② $b\to c\to d$: $c$에서 머리-꼬리, $c\in C$ → 막힘. 모두 막혔으므로 **성립**.
- **(8.36) $a\perp\!\!\!\perp c\mid\{b\}$:** 경로 ① $a\to b\to c$: $b$에서 머리-꼬리, $b\in C$ → 막힘. 경로 ② $a\to d\leftarrow c$: $d$에서 머리-머리, $d\notin C$이고 자손 $e\notin C$ → 막힘. **성립**.
- **(8.37) $b\not\perp\!\!\!\perp d\mid\{c\}$:** 경로 $b\leftarrow a\to d$에서 $a$는 꼬리-꼬리인데 $a\notin C$ → 열림. 열린 경로가 있으므로 독립이 아니다. **교재 문장이 맞다.**
- **(8.38) $a\not\perp\!\!\!\perp c\mid\{b,e\}$:** 경로 $a\to d\leftarrow c$에서 $d$는 머리-머리이고 $d\notin C$이지만 자손 $e\in C$ → 열림. **교재 문장이 맞다.** $e$를 보면 $d$에 대한 정보가 생기고, 그러면 $d$의 두 원인 $a$와 $c$가 서로 얽힌다("설명해 없애기", explaining away).

**(b)**

- **(i) $a\perp\!\!\!\perp c$ (조건 없음):** $a\to b\to c$에서 $b$는 머리-꼬리이고 $b\notin C$ → 열림. **성립하지 않음.** ($a\to d\leftarrow c$는 막혀 있지만, 열린 경로가 하나라도 있으면 안 된다.)
- **(ii) $b\perp\!\!\!\perp e\mid\{d\}$:** $e$의 이웃은 $d$뿐이라 모든 경로가 $\cdots d\to e$로 끝난다. $b\leftarrow a\to d\to e$와 $b\to c\to d\to e$ 둘 다 $d$에서 머리-꼬리이고 $d\in C$ → 막힘. **성립.**
- **(iii) $a\perp\!\!\!\perp e\mid\{b,c\}$:** $a\to d\to e$에서 $d$는 머리-꼬리이고 $d\notin C$ → 열림. **성립하지 않음.**
- **(iv) $b\perp\!\!\!\perp e\mid\{a,c\}$:** $b\leftarrow a\to d\to e$는 $a$(꼬리-꼬리, $a\in C$)에서 막힘. $b\to c\to d\to e$는 $c$(머리-꼬리, $c\in C$)에서 막힘. **성립.**

---

### 8-6. 잠재변수 모델: 주변화와 사후분포

**(a)** $z$가 이산이라 (8.25)의 적분이 합이 된다.

$$
\begin{aligned}
p(x=1)&=\sum_zp(x=1\mid z)p(z)\\
&=0.3(0.2420)+0.7(0.0540).
\end{aligned}
$$

$=0.0726+0.0378$이다.

**답:** $p(x=1)\approx0.1104$

**(b)** 베이즈 정리 (8.28):

$$
\begin{aligned}
&p(z=1\mid x=1)\\
&=\frac{p(x=1\mid z=1)\,p(z=1)}{p(x=1)}\\
&=\frac{0.0726}{0.1104}.
\end{aligned}
$$

**답:** $\approx0.658$

**(c)** 0.3에서 0.658로 **커졌다.** $x=1$은 성분 1의 평균 0에서 1, 성분 2의 평균 3에서 2만큼 떨어져 있다. 가능도 비는 $\frac{\mathcal N(1\mid0,1)}{\mathcal N(1\mid3,1)}=\frac{e^{-0.5}}{e^{-2}}=e^{1.5}\approx4.48$이다. 사후 오즈 = 사전 오즈 × 가능도 비 $=\frac{0.3}{0.7}\times4.48\approx1.92$이고, 확률로 바꾸면 $\frac{1.92}{2.92}\approx0.658$이다. 11장의 책임도가 바로 이 계산이다.

---

### 8-7. 베이즈 팩터로 모델 비교

**(a)** 공정한 동전에서 정해진 수열 하나가 나올 확률이다.

**답:** $p(\mathcal D\mid M_1)=0.5^8=\frac1{256}\approx0.003906$

**(b)** 균등 사전분포의 밀도는 1이므로 (8.44)는

$$
p(\mathcal D\mid M_2)=\int_0^1\mu^6(1-\mu)^2\cdot1\,d\mu.
$$

힌트에서 $a=7$, $b=3$: $\frac{6!\,2!}{9!}=\frac{720\cdot2}{362880}=\frac1{252}$.

**답:** $\frac1{252}\approx0.003968$

**(c)** 베이즈 팩터 (8.46)~(8.47):

$$
\frac{p(\mathcal D\mid M_2)}{p(\mathcal D\mid M_1)}=\frac{1/252}{1/256}=\frac{256}{252}.
$$

**답:** $\approx1.016$. 1보다 아주 조금 크므로 규칙대로라면 $M_2$를 고르지만, 사실상 데이터가 두 모델을 거의 가르지 못한다는 뜻이다.

**(d)** $M_2$의 최대 가능도는 $\mu=0.75$에서

$$
\begin{aligned}
0.75^6\times0.25^2&\approx0.1780\times0.0625\\
&\approx0.01112.
\end{aligned}
$$

$p(\mathcal D\mid M_1)$의 약 **2.85배**다. 최대가능도로 비교하면 $M_2$가 분명히 이긴다. $M_1$은 $M_2$ 안의 한 점($\mu=0.5$)이라서 $M_2$의 최댓값은 언제나 $M_1$ 이상이다. 그런데 증거(주변 가능도)는 최댓값이 아니라 **사전분포로 평균한 가능도**다. $M_2$는 $\mu=0.1$처럼 이 데이터를 잘 설명하지 못하는 값에도 사전 확률을 나눠 주므로 평균이 내려간다. 복잡한 모델이 자동으로 벌점을 받는 것, 이것이 8.6.2절의 "자동 오컴의 면도날"이다.

**(e)** 8번 모두 앞면이면 $p(\mathcal D\mid M_1)=\frac1{256}$, $p(\mathcal D\mid M_2)=\int_0^1\mu^8d\mu=\frac19$.

$$
\text{베이즈 팩터}=\frac{1/9}{1/256}=\frac{256}9\approx28.4.
$$

사후 오즈 = 사전 오즈 × 베이즈 팩터 (8.46):

$$
\frac{p(M_2\mid\mathcal D)}{p(M_1\mid\mathcal D)}=\frac{0.2}{0.8}\times28.4\approx7.11.
$$

**답:** 베이즈 팩터 $\approx28.4$, 사후 오즈 $\approx7.11$ (즉 $p(M_2\mid\mathcal D)\approx\frac{7.11}{8.11}\approx0.877$). 사전에 공정한 동전을 4배 더 믿었어도 데이터가 이를 뒤집는다.

---

### 8-8. AIC와 BIC

**(a)** AIC $=\log p-M$:
- $A$: $-120-2=-122$
- $B$: $-116-4=-120$
- $C$: $-111-10=-121$

**답:** 교재는 값이 **큰** 모델을 고르므로 $B$.

**(b)** $\frac12\log N=\frac12(4.605)=2.303$. BIC $=\log p-2.303M$:
- $A$: $-120-4.61=-124.61$
- $B$: $-116-9.21=-125.21$
- $C$: $-111-23.03=-134.03$

**답:** $A$.

**(c)** 매개변수 하나당 벌점이 AIC는 1, BIC는 $\frac12\log N$이다. $N=100$이면 2.303이고, $N>e^2\approx7.4$이면 BIC 벌점이 더 크다. $A\to B$로 가면 로그 가능도가 4 늘고 매개변수가 2개 는다. AIC 벌점은 2라서 이득이 크고($B$ 선택), BIC 벌점은 4.61이라서 손해다($A$ 선택). 교재: "BIC는 AIC보다 모델 복잡도를 더 무겁게 벌한다."

**(d)** $2M-2\log p=-2(\log p-M)$, 즉 교재 AIC에 $-2$를 곱한 값이다. 음수를 곱하면 순서가 뒤집히므로 "교재 AIC 최대" ⇔ "흔한 AIC 최소"이고, 고르는 모델은 같다. 이 문제에서는 244, 240, 242로 $B$가 가장 작다. BIC도 흔히 $M\log N-2\log p$로 쓰는데, 같은 관계다.

---

### 8-9. 교차 검증과 중첩 교차 검증

**(a)** (8.39): 다섯 조각 값의 평균. 표준편차는 편차 제곱의 평균(분모 $K=5$)의 제곱근이다.

- $\lambda=0.01$: 평균 $\frac{16.0}5=3.2$. 편차 $-0.3,0.2,-0.1,0.4,-0.2$, 제곱합 $0.34$, $\sigma=\sqrt{0.068}=0.261$, 표준오차 $\frac{0.261}{\sqrt5}=0.117$
- $\lambda=0.1$: 평균 $\frac{14.0}5=2.8$. 편차 $-0.2,0.1,-0.1,0.2,0$, 제곱합 $0.10$, $\sigma=\sqrt{0.02}=0.141$, 표준오차 $0.063$
- $\lambda=1$: 평균 $\frac{15.5}5=3.1$. 편차 $-0.1,0,-0.2,0.1,0.2$, 제곱합 $0.10$, $\sigma=0.141$, 표준오차 $0.063$

(분모를 $K-1$로 하면 표준편차가 약간 커지지만 결론은 같다.)

**(b)** **$\lambda=0.1$.** 평균 RMSE가 가장 작고, 다음 후보(3.1)와의 차이 0.3이 표준오차(약 0.06)보다 훨씬 크다.

**(c)** 2.8은 세 후보 중 **가장 작은 값을 골라서** 얻은 숫자다. 고르는 데 쓴 검증 데이터로 성능까지 재면 운 좋게 낮게 나온 후보를 고른 효과까지 들어가 낙관적으로 치우친다. 교재 8.2.3절도 테스트 데이터를 본 뒤 다시 학습으로 돌아가지 말라고 한다. 그래서 고르는 데 쓰지 않은 데이터가 따로 필요하다.

중첩 교차 검증(8.6.1절, 그림 8.13)은 이를 두 겹으로 한다.
- **바깥쪽 고리:** 데이터를 나눠 한 조각을 **테스트 집합**으로 떼어 둔다. 남은 데이터로 안쪽 고리를 돌려 고른 모델을 이 테스트 조각에서 평가한다. 조각을 바꿔 가며 평균한 값이 일반화 성능 추정이다.
- **안쪽 고리:** 바깥쪽 훈련 부분만으로 다시 교차 검증을 해서 **검증 집합** 성능으로 $\lambda$나 모델을 고른다.

---

## 9장 선형 회귀

### 9-1. 직선 맞추기: 정규방정식

**(a)**

$$
\Phi=\begin{bmatrix}1&-1\\1&0\\1&1\\1&2\end{bmatrix},\quad y=\begin{bmatrix}0\\1\\1\\3\end{bmatrix}.
$$

$\Phi^\top\Phi=\begin{bmatrix}N&\sum x\\\sum x&\sum x^2\end{bmatrix}$이고 $\sum x=2$, $\sum x^2=1+0+1+4=6$이다. $\Phi^\top y=\begin{bmatrix}\sum y\\\sum xy\end{bmatrix}$이고 $\sum y=5$, $\sum xy=0+0+1+6=7$이다.

**답:** $\Phi^\top\Phi=\begin{bmatrix}4&2\\2&6\end{bmatrix}$, $\Phi^\top y=\begin{bmatrix}5\\7\end{bmatrix}$

**(b)** $\det=24-4=20$, $(\Phi^\top\Phi)^{-1}=\frac1{20}\begin{bmatrix}6&-2\\-2&4\end{bmatrix}$.

$$
\theta_{\text{ML}}=\frac1{20}\begin{bmatrix}30-14\\-10+28\end{bmatrix}=\frac1{20}\begin{bmatrix}16\\18\end{bmatrix}.
$$

**답:** $\theta_{\text{ML}}=[0.8,\ 0.9]^\top$, 즉 $f(x)=0.8+0.9x$

**(c)** 예측 $\Phi\theta=[-0.1,\ 0.8,\ 1.7,\ 2.6]$, 잔차 $r=[0.1,\ 0.2,\ -0.7,\ 0.4]$.
- 첫째 열 $[1,1,1,1]$과의 내적: $0.1+0.2-0.7+0.4=0$
- 둘째 열 $[-1,0,1,2]$와의 내적: $-0.1+0-0.7+0.8=0$

둘 다 0이다. 정규방정식 $\Phi^\top(y-\Phi\theta)=0$을 그대로 확인한 것이다(9.4절의 사영 해석).

**(d)** (9.22): $\sigma^2_{\text{ML}}=\frac14(0.01+0.04+0.49+0.16)=\frac{0.70}4$.

**답:** $\sigma^2_{\text{ML}}=0.175$, RMSE (9.23) $=\sqrt{0.175}\approx0.418$

---

### 9-2. 노이즈 분산의 최대가능도

**(a)** 잔차 제곱합을 $R=\sum_n(y_n-\phi^\top(x_n)\theta)^2$이라 하자. 로그 가능도는

$$
\begin{aligned}
\log p&=-\frac N2\log(2\pi)-\frac N2\log\sigma^2\\
&\quad-\frac{R}{2\sigma^2}.
\end{aligned}
$$

$\sigma^2$를 하나의 변수로 보고 미분하면 (9.21)

$$
\frac{\partial\log p}{\partial\sigma^2}=-\frac N{2\sigma^2}+\frac R{2\sigma^4}=0.
$$

양변에 $2\sigma^4$를 곱하면 $-N\sigma^2+R=0$이다.

**답:** $\sigma^2_{\text{ML}}=\frac RN=\frac1N\sum_n(y_n-\phi^\top(x_n)\theta)^2$ (9.22)

**(b)** $v=\sigma^2$로 두면 도함수는 $\frac{R-Nv}{2v^2}$이다. $v<R/N$이면 양수(증가), $v>R/N$이면 음수(감소)이므로 $v=R/N$은 최대점이다.

**(c)** $\sigma^2_{\text{ML}}=R/N$을 넣으면 마지막 항이 $\frac{R}{2R/N}=\frac N2$가 된다.

$$
\log p_{\max}=-\frac N2\log(2\pi\sigma^2_{\text{ML}})-\frac N2.
$$

9-1의 숫자: $N=4$, $2\pi(0.175)=1.0996$, $\log1.0996=0.0949$.

**답:** $-2(0.0949)-2\approx-2.190$

---

### 9-3. 다항 특징과 과적합

**(a)** (9.17) 형식으로 행마다 $[1,x_n,x_n^2]$을 쓴다.

$$
\Phi=\begin{bmatrix}1&-1&1\\1&0&0\\1&1&1\end{bmatrix}.
$$

$\Phi$가 정사각이고 가역(서로 다른 $x$의 방데르몽드 행렬)이므로 $(\Phi^\top\Phi)^{-1}\Phi^\top=\Phi^{-1}$이고, $\theta_{\text{ML}}$은 $\Phi\theta=y$의 해다.
- 둘째 행: $\theta_0=0$
- 첫째·셋째 행: $-\theta_1+\theta_2=2$, $\theta_1+\theta_2=1$ → $\theta_2=1.5$, $\theta_1=-0.5$

**답:** $\theta_{\text{ML}}=[0,\ -0.5,\ 1.5]^\top$, $f(x)=-0.5x+1.5x^2$

**(b)** $\Phi=\begin{bmatrix}1&-1\\1&0\\1&1\end{bmatrix}$, $\Phi^\top\Phi=\begin{bmatrix}3&0\\0&2\end{bmatrix}$($\sum x=0$이라 대각), $\Phi^\top y=\begin{bmatrix}3\\-2+1\end{bmatrix}=\begin{bmatrix}3\\-1\end{bmatrix}$.

$\theta=[3/3,\ -1/2]=[1,\ -0.5]$. 예측 $1.5,\ 1,\ 0.5$, 잔차 $0.5,\ -1,\ 0.5$, 제곱합 $1.5$.

**답:** $f(x)=1-0.5x$, 훈련 RMSE $=\sqrt{1.5/3}=\sqrt{0.5}\approx0.707$

**(c)** 2차식은 세 점을 모두 지나므로 **훈련 RMSE = 0**.

**(d)** $x=2$에서
- 2차: $-1+6=5$, 오차 $1.5-5=-3.5$ (제곱 12.25)
- 직선: $1-1=0$, 오차 $1.5$ (제곱 2.25)

매개변수 수가 데이터 수와 같으면($K=N$) 모든 점을 지나 훈련 오차가 0이 되지만, 새 점에서는 훨씬 틀린다. 그림 9.6에서 훈련 RMSE는 차수를 올려도 절대 늘지 않는다(차수가 낮은 모델이 높은 모델에 포함되므로). 반면 테스트 RMSE는 처음엔 줄다가 차수가 너무 높아지면 크게 는다. 이 문제는 그 그림의 양 끝을 작은 숫자로 본 것이다.

---

### 9-4. MAP 추정과 릿지 회귀

**(a)** 베이즈 정리의 로그 (9.25)에 가능도와 사전분포를 넣으면 (9.28)

$$
\begin{aligned}
&-\log p(\theta\mid\mathcal X,\mathcal Y)\\
&=\frac{\|y-\Phi\theta\|^2}{2\sigma^2}+\frac{\theta^\top\theta}{2b^2}+\text{const}.
\end{aligned}
$$

8-2(b)와 같은 규칙으로 미분하면 (9.29)

$$
\frac{d}{d\theta}=\frac1{\sigma^2}\big(\theta^\top\Phi^\top\Phi-y^\top\Phi\big)+\frac1{b^2}\theta^\top.
$$

$0^\top$으로 놓고 $\sigma^2$를 곱하면 $\theta^\top\big(\Phi^\top\Phi+\frac{\sigma^2}{b^2}I\big)=y^\top\Phi$. 괄호 안 행렬이 대칭이므로 전치하면

**답:** $\theta_{\text{MAP}}=\big(\Phi^\top\Phi+\frac{\sigma^2}{b^2}I\big)^{-1}\Phi^\top y$ (9.31)

**(b)** $\Phi^\top\Phi+2I=\begin{bmatrix}6&2\\2&8\end{bmatrix}$, $\det=48-4=44$, 역행렬 $\frac1{44}\begin{bmatrix}8&-2\\-2&6\end{bmatrix}$.

$$
\theta_{\text{MAP}}=\frac1{44}\begin{bmatrix}40-14\\-10+42\end{bmatrix}=\frac1{44}\begin{bmatrix}26\\32\end{bmatrix}.
$$

**답:** $\theta_{\text{MAP}}\approx[0.591,\ 0.727]^\top$

**(c)** $\|\theta_{\text{ML}}\|^2=0.64+0.81=1.45$, $\|\theta_{\text{MAP}}\|^2=\frac{26^2+32^2}{44^2}=\frac{1700}{1936}\approx0.878$. 사전분포가 매개변수를 원점 쪽으로 끌어당겨 크기가 줄었다. 이 설정에서는 절편 $\theta_0$도 같이 줄어든다.

**(d)** (9.28)에 $2\sigma^2$를 곱하면 $\|y-\Phi\theta\|^2+\frac{\sigma^2}{b^2}\|\theta\|^2+\text{const}$가 되어 (9.32)와 같은 꼴이다.

**답:** $\lambda=\sigma^2/b^2$. 노이즈가 크거나 사전분포가 좁을수록(확신이 강할수록) 정규화가 세다.

---

### 9-5. 베이즈 선형 회귀: 사후분포와 예측

$\sum x_n^2=1+4=5$, $\sum x_ny_n=2+6=8$, $\sigma^2=1$, $m_0=0$, $S_0=1$.

**(a)** (9.43)을 스칼라로 쓰면

$$
S_N=\Big(\frac1{S_0}+\frac{\sum x_n^2}{\sigma^2}\Big)^{-1}=\frac1{1+5}=\frac16.
$$

$$
\begin{aligned}
m_N&=S_N\Big(\frac{m_0}{S_0}+\frac{\sum x_ny_n}{\sigma^2}\Big)\\
&=\frac16\cdot8=\frac43.
\end{aligned}
$$

**답:** $p(\theta\mid\mathcal X,\mathcal Y)=\mathcal N\big(\frac43,\ \frac16\big)$

**(b)** $\theta_{\text{ML}}=\frac{\sum xy}{\sum x^2}=\frac85=1.6$. $m_N\approx1.333$은 사전 평균 0 쪽으로 줄어든 값이다. $\lambda=\sigma^2/S_0=1$인 MAP $\frac8{5+1}$과 같다(가우시안 사후분포는 평균=최빈값).

**(c)** (9.57c): 평균 $x_*m_N$, 분산 $x_*^2S_N+\sigma^2$.
- $x_*=0$: 평균 0, 분산 $0+1=1$
- $x_*=3$: 평균 $3\cdot\frac43=4$, 분산 $9\cdot\frac16+1=2.5$

이 모델은 원점을 지나는 직선이라 $x_*=0$에서는 매개변수 불확실성이 사라지고 노이즈만 남는다. $x_*$가 커지면 기울기의 불확실성이 $x_*^2$배로 커진다.

**(d)** (9.38): 평균 $x_*m_0=0$, 분산 $x_*^2S_0+\sigma^2=9+1=10$. 데이터 두 개로 예측 분산이 10에서 2.5로 줄었다.

**(e)** 순차 갱신: 사전분포를 $\mathcal N(\frac43,\frac16)$으로 두고 점 $(-1,-1)$ 하나를 넣는다.

$$
\begin{aligned}
S'&=\Big(6+\frac{(-1)^2}1\Big)^{-1}=\frac17,\\
m'&=\frac17\Big(6\cdot\frac43+(-1)(-1)\Big)=\frac97.
\end{aligned}
$$

한꺼번에: $\sum x^2=6$, $\sum xy=2+6+1=9$이므로 $S=\frac1{1+6}=\frac17$, $m=\frac97$.

**답:** 둘 다 $\mathcal N\big(\frac97,\frac17\big)\approx\mathcal N(1.286,\ 0.143)$. 오늘의 사후분포가 내일의 사전분포가 된다.

---

### 9-6. 주변 가능도로 모델 비교

이차원 가우시안의 로그 밀도는 $\log\mathcal N(y\mid0,K)=-\log2\pi-\frac12\log\det K-\frac12y^\top K^{-1}y$이다.

**(a)** (9.64b): $X=[1,2]^\top$이라 $XX^\top=\begin{bmatrix}1&2\\2&4\end{bmatrix}$, $K=XX^\top+I=\begin{bmatrix}2&2\\2&5\end{bmatrix}$.
- $\det K=10-4=6$
- $K^{-1}=\frac16\begin{bmatrix}5&-2\\-2&2\end{bmatrix}$
- $y^\top K^{-1}y=\frac16(5\cdot4-2\cdot2\cdot2\cdot3+2\cdot9)=\frac16(20-24+18)=\frac73$

$$
\log p=-1.8379-\tfrac12(1.7918)-\tfrac12\cdot\tfrac73.
$$

**답:** $-1.8379-0.8959-1.1667\approx-3.900$

**(b)** $K=I$: $\log p=-1.8379-0-\frac12(4+9)$.

**답:** $\approx-8.338$

**(c)** $K=100XX^\top+I=\begin{bmatrix}101&200\\200&401\end{bmatrix}$.
- $\det K=101\cdot401-200^2=40501-40000=501$
- $y^\top K^{-1}y=\frac1{501}(401\cdot4-2\cdot200\cdot6+101\cdot9)=\frac{1604-2400+909}{501}=\frac{113}{501}\approx0.2255$

$$
\begin{aligned}
\log p&=-1.8379-\tfrac12(6.2166)\\
&\quad-\tfrac12(0.2255).
\end{aligned}
$$

**답:** $-1.8379-3.1083-0.1128\approx-5.059$

**(d)** 순서: (a) $-3.90$ > (c) $-5.06$ > (b) $-8.34$.
- $M_0$은 너무 단순하다. 분산 1의 노이즈만으로 $y=(2,3)$을 설명해야 하니 가능도가 작다.
- 사전분포가 넓은 (c)는 $\theta$가 $-20$이든 $20$이든 그럴듯하다고 보므로 가능한 데이터셋이 아주 많다. 증거는 모든 데이터셋에 대해 합이 1이어야 하므로(그림 8.14), 확률을 넓게 흩뿌린 모델은 실제로 관측한 데이터셋에 적은 확률밖에 주지 못한다. 가장 잘 맞는 직선은 (a)와 같은 모델 족에 있는데도 증거가 낮다.
- 사전분포를 더 넓히면 $\log p\approx-1.84-\frac12\log(1+5s_0)-0.1$처럼 계속 떨어진다. 수치로 풀면 $s_0\approx7.2\times10^4$을 넘을 때 $M_0$보다도 낮아진다. 이것이 제프리스-린들리 역설이 말하는 현상(너무 넓은 사전분포를 준 복잡한 모델은 단순한 모델에 진다)이다.

---

### 9-7. 최소제곱은 직교사영이다

**(a)** $X^\top X=1+4+4=9$, $X^\top y=1+2+8=11$.

**답:** $\theta_{\text{ML}}=\frac{11}9\approx1.222$

**(b)** $X\theta_{\text{ML}}=\frac{11}9[1,2,2]^\top\approx[1.222,\ 2.444,\ 2.444]^\top$.

$$
P=\frac{XX^\top}{X^\top X}=\frac19\begin{bmatrix}1&2&2\\2&4&4\\2&4&4\end{bmatrix}.
$$

**(c)** 잔차 $y-X\theta=\big[1-\frac{11}9,\ 1-\frac{22}9,\ 4-\frac{22}9\big]=\frac19[-2,\ -13,\ 14]$. $X$와의 내적은 $\frac19(-2-26+28)=0$이다.

**(d)**
- $P^2=X(X^\top X)^{-1}X^\top X(X^\top X)^{-1}X^\top=X(X^\top X)^{-1}X^\top=P$. 이미 직선 위에 있는 점은 다시 사영해도 그대로다.
- $P^\top=P$: 대칭이면 **직교**사영이다. 잔차가 부분공간과 수직이 된다.
- $\text{tr}(P)=\frac{1+4+4}9=1$. 일반적으로 $\text{tr}(P)=\text{tr}\big((X^\top X)^{-1}X^\top X\big)=\text{tr}(I_D)=D$, 즉 부분공간의 차원(매개변수 수)이다.

---

### 9-8. 데이터가 많아지면 베이즈 사후 평균은 MLE로 간다

**(a)** (9.43)의 스칼라판:

$$
\begin{aligned}
S_N&=\Big(\frac1{s_0}+\frac{\sum x_n^2}{\sigma^2}\Big)^{-1},\\
m_N&=S_N\Big(\frac{m_0}{s_0}+\frac{\sum x_ny_n}{\sigma^2}\Big).
\end{aligned}
$$

**(b)** 데이터 정밀도 $A=\frac{\sum x_n^2}{\sigma^2}$, 사전 정밀도 $a_0=\frac1{s_0}$라 하자. $\theta_{\text{ML}}=\frac{\sum x_ny_n}{\sum x_n^2}$이므로 $\frac{\sum x_ny_n}{\sigma^2}=A\,\theta_{\text{ML}}$이다.

$$
\begin{aligned}
m_N&=\frac{a_0m_0+A\,\theta_{\text{ML}}}{a_0+A}\\
&=w\,\theta_{\text{ML}}+(1-w)\,m_0.
\end{aligned}
$$

**답:** $w=\frac{A}{A+a_0}$. 정밀도(분산의 역수)로 가중한 평균이다.

**(c)** $\sum x_n^2\to\infty$이면 $A\to\infty$이므로 $S_N=\frac1{a_0+A}\to0$이고 $w\to1$, 따라서 $m_N\to\theta_{\text{ML}}$. 데이터가 충분하면 사전분포의 영향이 사라지고, 불확실성도 0으로 줄어든다.

**(d)** $s_0\to0$이면 $a_0\to\infty$이므로 $w\to0$, $m_N\to m_0$, $S_N\to0$. 사전분포를 너무 확신하면 데이터를 무시한다.

---

### 9-9. $\Phi^\top\Phi$의 역행렬이 없을 때

**(a)** $\Phi=\begin{bmatrix}1&2\\2&4\\3&6\end{bmatrix}$, $\sum x^2=14$이므로

$$
\Phi^\top\Phi=\begin{bmatrix}14&28\\28&56\end{bmatrix}.
$$

$\det=14\cdot56-28^2=784-784=0$이라 역행렬이 없다. 두 열이 일차종속이라 $\text{rk}(\Phi)=1<2$이고, (9.12) 옆 주석이 요구하는 "랭크 = 매개변수 수" 조건이 깨진다.

**(b)** $\Phi^\top y=[\sum xy,\ 2\sum xy]^\top=[11,\ 22]^\top$. 정규방정식은 $14\theta_1+28\theta_2=11$과 그 두 배인 식뿐이다. 즉 $\theta_1+2\theta_2=\frac{11}{14}$을 만족하는 직선 위의 모든 점이 해다(예: $(\frac{11}{14},0)$, $(0,\frac{11}{28})$). 그런데 예측은

$$
\begin{aligned}
f(x)&=\theta_1x+\theta_2(2x)\\
&=(\theta_1+2\theta_2)x=\tfrac{11}{14}x
\end{aligned}
$$

로 모든 해가 같다. 예측은 정해지지만 매개변수는 하나로 정해지지 않는다.

**(c)** $\Phi^\top\Phi+I=\begin{bmatrix}15&28\\28&57\end{bmatrix}$, $\det=855-784=71$, 역행렬 $\frac1{71}\begin{bmatrix}57&-28\\-28&15\end{bmatrix}$.

$$
\theta=\frac1{71}\begin{bmatrix}627-616\\-308+330\end{bmatrix}=\frac1{71}\begin{bmatrix}11\\22\end{bmatrix}.
$$

**답:** $\theta\approx[0.155,\ 0.310]^\top$. 예측 기울기 $\theta_1+2\theta_2=\frac{55}{71}\approx0.775$로 $\frac{11}{14}\approx0.786$보다 조금 줄었다. 릿지는 해 중에서 $(1,2)$ 방향, 즉 노름이 작은 쪽을 고른다(**교재 밖 보충:** $\lambda\to0$이면 최소 노름 해 $\frac1{70}(11,22)$로 간다).

**(d)** 모든 $v\neq0$에 대해 $v^\top(\Phi^\top\Phi+\lambda I)v=\|\Phi v\|^2+\lambda\|v\|^2\ge\lambda\|v\|^2>0$이다. 양의 정부호이므로 고유값이 모두 $\lambda$ 이상이고 역행렬이 있다.

---

## 10장 PCA

### 10-1. 네 점 PCA 처음부터 끝까지

**(a)** $\mu=\big(\frac{3+2-1+0}4,\ \frac{3+4+1+0}4\big)=(1,2)$. 중심화: $(2,1),\ (1,2),\ (-2,-1),\ (-1,-2)$.

**(b)** $S=\frac14\sum x_nx_n^\top$ (중심화된 점):
- $S_{11}=\frac{4+1+4+1}4=2.5$
- $S_{12}=\frac{2+2+2+2}4=2$
- $S_{22}=\frac{1+4+1+4}4=2.5$

**답:** $S=\begin{bmatrix}2.5&2\\2&2.5\end{bmatrix}$

**(c)** $(2.5-\lambda)^2-4=0$이므로 $2.5-\lambda=\pm2$.
- $\lambda_1=4.5$: $S-4.5I=\begin{bmatrix}-2&2\\2&-2\end{bmatrix}$ → $b_1=\frac1{\sqrt2}(1,1)$
- $\lambda_2=0.5$: $S-0.5I=\begin{bmatrix}2&2\\2&2\end{bmatrix}$ → $b_2=\frac1{\sqrt2}(1,-1)$

**(d)** $z_n=b_1^\top(x_n-\mu)$: $\frac{2+1}{\sqrt2}=\frac3{\sqrt2}$, $\frac3{\sqrt2}$, $-\frac3{\sqrt2}$, $-\frac3{\sqrt2}$ ($\approx\pm2.121$). 평균이 0이므로 분산은 $\frac14\cdot4\cdot\frac92=4.5=\lambda_1$ (10.15).

**(e)** $b_1z_n=\frac3{\sqrt2}\cdot\frac1{\sqrt2}(1,1)=(1.5,1.5)$ 또는 그 음수.
- $\tilde x_1=\tilde x_2=(1,2)+(1.5,1.5)=(2.5,\ 3.5)$
- $\tilde x_3=\tilde x_4=(1,2)-(1.5,1.5)=(-0.5,\ 0.5)$

오차: $x_1-\tilde x_1=(0.5,-0.5)$, $x_2-\tilde x_2=(-0.5,0.5)$, $x_3-\tilde x_3=(-0.5,0.5)$, $x_4-\tilde x_4=(0.5,-0.5)$. 제곱 노름은 모두 $0.5$.

**답:** 평균 제곱 재구성 오차 $=0.5=\lambda_2$ (10.44). 두 점씩 같은 점으로 복원된다. 버린 방향 $b_2$의 정보가 사라졌기 때문이다.

---

### 10-2. 3차원에서 주성분 개수 고르기

**(a)** $S$는 왼쪽 위 $2\times2$ 블록과 오른쪽 아래 $1\times1$ 블록으로 나뉜다. 블록 $\begin{bmatrix}3&1\\1&3\end{bmatrix}$의 고유값은 $3\pm1$이다.

**답:** $\lambda_1=4$, $b_1=\frac1{\sqrt2}(1,1,0)$; $\lambda_2=2$, $b_2=\frac1{\sqrt2}(1,-1,0)$; $\lambda_3=1$, $b_3=(0,0,1)$

**(b)** 전체 분산 $V_D=\text{tr}S=3+3+1=7=4+2+1$.
- $M=1$: $J_1=2+1=3$, 설명된 비율 $\frac47\approx57.1\%$
- $M=2$: $J_2=1$, 설명된 비율 $\frac67\approx85.7\%$

**(c)**
- $M=1$: $z=b_1^\top x=\frac{2+0}{\sqrt2}=\sqrt2$, $\tilde x=b_1z=(1,1,0)$. 오차 $x-\tilde x=(1,-1,1)$, 제곱 오차 **3**
- $M=2$: $b_2^\top x=\frac{2-0}{\sqrt2}=\sqrt2$이므로 $\tilde x=(1,1,0)+(1,-1,0)=(2,0,0)$. 오차 $(0,0,1)$, 제곱 오차 **1**

$J_M$은 데이터 전체의 **평균** 오차이고, 한 점의 오차는 그와 다를 수 있다. 여기서는 우연히 같다.

---

### 10-3. 최대 분산 방향은 가장 큰 고유벡터다

**(a)** 데이터가 중심화되어 $z_{1n}$의 평균도 0이다. 그러므로

$$
V_1=\frac1N\sum_nz_{1n}^2=\frac1N\sum_nb_1^\top x_nx_n^\top b_1.
$$

$b_1$을 합 밖으로 꺼내면 $V_1=b_1^\top\Big(\frac1N\sum_nx_nx_n^\top\Big)b_1=b_1^\top Sb_1$ (10.9).

**(b)** $b_1$을 $c$배 하면 $V_1$이 $c^2$배가 되어 얼마든지 커진다. 우리가 원하는 것은 방향이지 길이가 아니므로 $\|b_1\|=1$로 고정한다 (10.10).

**(c)** 라그랑주 함수 (10.11)

$$
L(b_1,\lambda_1)=b_1^\top Sb_1+\lambda_1(1-b_1^\top b_1).
$$

편미분 (10.12): $\frac{\partial L}{\partial b_1}=2b_1^\top S-2\lambda_1b_1^\top$, $\frac{\partial L}{\partial\lambda_1}=1-b_1^\top b_1$. 둘을 0으로 놓고 $S$가 대칭임을 쓰면

**답:** $Sb_1=\lambda_1b_1$, $b_1^\top b_1=1$ (10.13)~(10.14). $b_1$은 $S$의 고유벡터이고 $\lambda_1$은 고유값이다.

**(d)** 고유벡터라면 $V_1=b_1^\top Sb_1=\lambda_1b_1^\top b_1=\lambda_1$ (10.15)이다. 분산이 곧 고유값이므로, 분산을 최대로 하려면 가장 큰 고유값의 고유벡터를 고른다.

**(e)** $B_1=b_1b_1^\top$이라 하자. $\hat X=(I-B_1)X$이므로

$$
\hat S=\tfrac1N\hat X\hat X^\top=(I-B_1)S(I-B_1).
$$

$S$의 고유벡터 $b_1,\dots,b_D$는 정규직교이므로 $(I-B_1)b_1=0$이고 $i\ge2$에 대해 $(I-B_1)b_i=b_i$다.
- $\hat Sb_1=(I-B_1)S\cdot0=0$
- $i\ge2$: $\hat Sb_i=(I-B_1)Sb_i=(I-B_1)\lambda_ib_i=\lambda_ib_i$

즉 $\hat S$의 고유값은 $0,\lambda_2,\dots,\lambda_D$이고 고유벡터는 그대로다. 남은 데이터에서 다시 분산을 최대로 하면 $\hat S$의 가장 큰 고유값 $\lambda_2$의 고유벡터 $b_2$가 나온다 (10.19)~(10.23).

---

### 10-4. SVD로 PCA 하기

**(a)** $XX^\top$의 (1,1) 성분은 첫 행의 제곱합 $4+1+4+1=10$, (1,2)는 두 행의 내적 $2+2+2+2=8$, (2,2)는 $1+4+1+4=10$.

**답:** $XX^\top=\begin{bmatrix}10&8\\8&10\end{bmatrix}$

**(b)** $X=U\Sigma V^\top$이면 $XX^\top=U\Sigma\Sigma^\top U^\top$이므로 특이값의 제곱이 $XX^\top$의 고유값이다. 고유값은 $10\pm8=18,\ 2$.

**답:** $\sigma_1=\sqrt{18}=3\sqrt2\approx4.243$, $\sigma_2=\sqrt2\approx1.414$

**(c)** $\lambda_d=\sigma_d^2/N$: $\frac{18}4=4.5$, $\frac24=0.5$. 10-1의 고유값과 같다. 주성분 방향은 $U$의 열(왼쪽 특이벡터)이다.

**(d)** 9장은 데이터를 행으로 쌓은 $X\in\mathbb R^{N\times D}$를 쓴다. 10장은 열로 쌓은 $X\in\mathbb R^{D\times N}$을 쓰고 $S=\frac1NXX^\top$이다. 교재도 (10.46) 옆에서 "보통의 데이터 행렬의 전치"라고 적어 둔다. 공식을 옮겨 쓸 때 $X^\top X$와 $XX^\top$을 바꿔 쓰기 쉽다.

---

### 10-5. $N<D$일 때: 작은 행렬의 고유벡터로 PCA 하기

**(a)** $x_1+x_2+x_3=(1-1+0,\ 0+1-1,\ 1+0-1,\ 0+1-1)=0$.

**(b)** 내적을 모두 구한다: $x_1\cdot x_1=2$, $x_2\cdot x_2=3$, $x_3\cdot x_3=3$, $x_1\cdot x_2=-1$, $x_1\cdot x_3=-1$, $x_2\cdot x_3=0-1+0-1=-2$.

**답:** $X^\top X=\begin{bmatrix}2&-1&-1\\-1&3&-2\\-1&-2&3\end{bmatrix}$

**(c)** 각 행의 합이 0이므로 $X^\top X[1,1,1]^\top=0$, 고유값 하나는 0이다. 나머지 두 고유값 $\lambda_a,\lambda_b$는
- 합 = 대각합 = $2+3+3=8$
- 곱 = $2\times2$ 주소행렬식의 합 = $(6-1)+(6-1)+(9-4)=15$ (고유값 하나가 0이라 두 개씩 곱한 합이 $\lambda_a\lambda_b$뿐이다)

$\lambda^2-8\lambda+15=0$이므로 $5,\ 3$이다. $\frac1NX^\top X$의 고유값은 $\frac53,\ 1,\ 0$이다.

고유벡터:
- 5: $(X^\top X-5I)c=0$의 둘째 행 $-c_1-2c_2-2c_3=0$과 $c\perp[1,1,1]$에서 $c_1=0$, $c_2=-c_3$ → $c^{(1)}=\frac1{\sqrt2}(0,1,-1)$
- 3: 앞의 두 벡터에 모두 수직 → $c^{(2)}=\frac1{\sqrt6}(2,-1,-1)$. 확인: $X^\top X(2,-1,-1)=(6,-3,-3)=3(2,-1,-1)$

**(d)** (10.56)에서 $\frac1NX^\top Xc=\lambda c$의 양변 왼쪽에 $X$를 곱하면 $\frac1NXX^\top(Xc)=\lambda(Xc)$ (10.57), 즉 $Xc$가 $S$의 고유벡터다.

$$
\begin{aligned}
Xc^{(1)}&=\tfrac1{\sqrt2}(x_2-x_3)\\
&=\tfrac1{\sqrt2}(-1,\ 2,\ 1,\ 2).
\end{aligned}
$$

길이의 제곱은 $c^\top X^\top Xc=5$이므로 $b_1=\frac{Xc^{(1)}}{\sqrt5}=\frac1{\sqrt{10}}(-1,2,1,2)$.

확인: $Sb_1=\frac13\sum_nx_n(x_n^\top b_1)$이고 $x_1^\top b_1=0$, $x_2^\top b_1=\frac5{\sqrt{10}}$, $x_3^\top b_1=-\frac5{\sqrt{10}}$이다. 따라서

$$
Sb_1=\frac{5}{3\sqrt{10}}(x_2-x_3)=\frac53\,b_1.
$$

**답:** $b_1=\frac1{\sqrt{10}}(-1,2,1,2)$, $\lambda_1=\frac53$. 같은 방법으로 $b_2=\frac1{\sqrt2}(1,0,1,0)$, $\lambda_2=1$이다.

**(e)** 고유분해 비용은 행렬 크기의 세제곱에 비례한다. 여기서는 $4\times4$ 대신 $3\times3$이지만, MNIST처럼 $D=784$이고 $N=100$이면 $784\times784$ 대신 $100\times100$을 푼다. $XX^\top$와 $X^\top X$의 0이 아닌 고유값은 같다(많아야 $N$개).

---

### 10-6. 표준화

**(a)** 특성방정식 $\lambda^2-101\lambda+(100-36)=0$.

$$
\begin{aligned}
\lambda&=\frac{101\pm\sqrt{101^2-256}}2\\
&=\frac{101\pm\sqrt{9945}}2\\
&=\frac{101\pm99.725}2.
\end{aligned}
$$

$\lambda_1\approx100.36$, $\lambda_2\approx0.64$. 고유벡터: $(100-100.36)u_1+6u_2=0$에서 $u_2\approx0.060u_1$, 정규화하면 $b_1\approx(0.998,\ 0.060)$.

**답:** 첫 주성분이 거의 첫째 축이다. 첫째 특징의 단위(cm)가 커서 분산이 100이기 때문이지, 데이터 구조 때문이 아니다.

**(b)** 각 특징을 표준편차로 나누면 공분산이 $S'_{ij}=S_{ij}/(\sigma_i\sigma_j)$가 된다: $S'_{11}=\frac{100}{100}=1$, $S'_{12}=\frac6{10\cdot1}=0.6$, $S'_{22}=1$.

**답:** $S'=\begin{bmatrix}1&0.6\\0.6&1\end{bmatrix}$, 고유값 $1\pm0.6=1.6,\ 0.4$, 고유벡터 $b_1=\frac1{\sqrt2}(1,1)$, $b_2=\frac1{\sqrt2}(1,-1)$. 두 특징이 같은 비중으로 들어간다.

**(c)**
1. 표준화 (10.58): $\big(\frac{185-170}{10},\ \frac{0.5-0}1\big)=(1.5,\ 0.5)$
2. 좌표 (10.60): $z_*=b_1^\top x_*=\frac{1.5+0.5}{\sqrt2}=\sqrt2\approx1.414$
3. 표준화 공간에서의 사영 (10.59): $\tilde x_*=b_1z_*=(1,\ 1)$
4. 되돌리기 (10.61): 표준편차를 곱하고 평균을 더한다. $(1\cdot10+170,\ 1\cdot1+0)$

**답:** $\tilde x_*=(180,\ 1)$. 교재는 PCA가 돌려주는 것은 사영 $\tilde x_*$가 아니라 좌표 $z_*$라고 강조한다.

---

### 10-7. 거듭제곱법

**(a)** 정규화 전 벡터: $Sx_0=(2,1)$, $S(2,1)=(5,4)$, $S(5,4)=(14,13)$.

**답:** $x_1=\frac{(2,1)}{\sqrt5}\approx(0.894,0.447)$, $x_2=\frac{(5,4)}{\sqrt{41}}\approx(0.781,0.625)$, $x_3=\frac{(14,13)}{\sqrt{365}}\approx(0.733,0.680)$. $\frac1{\sqrt2}(1,1)\approx(0.707,0.707)$로 다가간다.

**(b)** 레일리 몫 $\frac{v^\top Sv}{v^\top v}$:
- $k=1$: $\frac{(2,1)\cdot(5,4)}5=\frac{14}5=2.8$
- $k=2$: $\frac{(5,4)\cdot(14,13)}{41}=\frac{122}{41}\approx2.976$
- $k=3$: $\frac{(14,13)\cdot(41,40)}{365}=\frac{1094}{365}\approx2.997$

**답:** $\lambda_1=3$으로 수렴한다.

**(c)** (**교재 밖 보충**) $x_0$를 고유벡터로 나누면 $x_0=(1,0)=\frac12(1,1)+\frac12(1,-1)$이다. 따라서

$$
\begin{aligned}
S^kx_0&=\tfrac12\,3^k(1,1)+\tfrac12\,1^k(1,-1)\\
&=\Big(\tfrac{3^k+1}2,\ \tfrac{3^k-1}2\Big).
\end{aligned}
$$

$b_2$ 성분은 $b_1$ 성분에 비해 매번 $\lambda_2/\lambda_1=\frac13$배로 줄어든다. 실제로 $b_1$과의 각도가 $18.4^\circ\to6.3^\circ\to2.1^\circ\to0.7^\circ$로 거의 3분의 1씩 준다. 두 고유값이 비슷하면 느리고, $x_0$에 $b_1$ 성분이 전혀 없으면 $b_1$에 도달하지 못한다.

---

### 10-8. 확률적 PCA

**(a)** $BB^\top=\begin{bmatrix}4&2\\2&1\end{bmatrix}$.

**답:** $BB^\top+\sigma^2I=\begin{bmatrix}5&2\\2&2\end{bmatrix}$ (10.70b)

**(b)** (10.71): $\text{Cov}[x,z]=B=[2,1]^\top$. (10.72):

$$
p(x,z)=\mathcal N\!\left(\begin{bmatrix}x\\z\end{bmatrix}\middle|\ 0,\ \begin{bmatrix}5&2&2\\2&2&1\\2&1&1\end{bmatrix}\right).
$$

**(c)** $\det\begin{bmatrix}5&2\\2&2\end{bmatrix}=6$, 역행렬 $\frac16\begin{bmatrix}2&-2\\-2&5\end{bmatrix}$. 먼저 $B^\top(BB^\top+\sigma^2I)^{-1}=\frac16[4-2,\ -4+5]=\frac16[2,\ 1]$.
- (10.74): $m=\frac16(2\cdot3+1\cdot1)=\frac76$
- (10.75): $C=1-\frac16(2\cdot2+1\cdot1)=1-\frac56=\frac16$

**답:** $p(z\mid x)=\mathcal N\big(\frac76,\ \frac16\big)\approx\mathcal N(1.167,\ 0.167)$

(**교재 밖 보충**) 역행렬 보조정리로 $m=(B^\top B+\sigma^2)^{-1}B^\top x=\frac7{5+1}$, $C=\sigma^2(B^\top B+\sigma^2)^{-1}=\frac16$로 더 빨리 구할 수 있다.

**(d)** $\sigma^2\to0$이면 $m\to(B^\top B)^{-1}B^\top x=\frac75=1.4$, $C\to0$. $Bm=(2.8,\ 1.4)$는 $x=(3,1)$을 직선 $\text{span}(B)$에 직교사영한 점이다. 이 값이 PCA 좌표 $b^\top x$와 같아지는 것은 $B$의 열이 정규직교일 때뿐이다. 여기서는 $\|B\|=\sqrt5$라서 정규화한 $b=B/\sqrt5$의 PCA 좌표는 $\frac7{\sqrt5}$이고, $1.4$와는 $\sqrt5$배 차이가 난다.

---

### 10-9. 재구성 오차는 버린 고유값의 합이다

**(a)** $\tilde x_n=\sum_{m=1}^Mz_{mn}b_m$ (10.28), $J_M=\frac1N\sum_n\|x_n-\tilde x_n\|^2$ (10.29). 연쇄법칙 (10.30):

$$
\frac{\partial J_M}{\partial z_{in}}=\frac{\partial J_M}{\partial\tilde x_n}\frac{\partial\tilde x_n}{\partial z_{in}}=-\frac2N(x_n-\tilde x_n)^\top b_i.
$$

$b$들이 정규직교이므로 $\tilde x_n^\top b_i=z_{in}$이고, 위 식은 $-\frac2N(x_n^\top b_i-z_{in})$ (10.31b)이다.

**답:** 0으로 놓으면 $z_{in}=x_n^\top b_i=b_i^\top x_n$ (10.32). 최적 좌표는 직교사영의 좌표다.

**(b)** 정규직교 기저로 $x_n$을 전부 펼치면 $x_n=\sum_{d=1}^D(b_d^\top x_n)b_d$ (10.37)이다. (a)의 최적 좌표를 쓴 $\tilde x_n$은 앞 $M$개 항이므로

$$
\begin{aligned}
x_n-\tilde x_n&=\sum_{j=M+1}^D(b_j^\top x_n)b_j\\
&=\sum_{j=M+1}^Db_jb_j^\top x_n.
\end{aligned}
$$

이것이 (10.38)이다. 오차 벡터는 버린 방향들만으로 이루어진다.

**(c)** 서로 수직인 벡터의 합의 제곱 노름은 제곱 노름의 합이다(피타고라스). 그래서 $\|x_n-\tilde x_n\|^2=\sum_{j>M}(b_j^\top x_n)^2$이고

$$
\begin{aligned}
J_M&=\frac1N\sum_n\sum_{j>M}b_j^\top x_nx_n^\top b_j\\
&=\sum_{j>M}b_j^\top Sb_j.
\end{aligned}
$$

이것이 (10.43)이다.

**(d)** $J_M$을 가장 작게 하려면 버리는 방향 $b_{M+1},\dots,b_D$를 가장 작은 고유값들의 고유벡터로 고른다. 그러면 $b_j^\top Sb_j=\lambda_j$이고 $J_M=\sum_{j=M+1}^D\lambda_j$ (10.44)이다. 전체 분산은 $V_D=\text{tr}S=\sum_{d=1}^D\lambda_d$이고, 남긴 분산은 $V_M=\sum_{m=1}^M\lambda_m$이므로 $V_D=V_M+J_M$ (10.24)~(10.25)이다. 전체 분산은 정해져 있으니 **재구성 오차를 최소로 하는 것과 남긴 분산을 최대로 하는 것은 같은 일**이다. 두 관점이 같은 답을 주는 이유다.

---

## 11장 GMM과 EM

### 11-1. 교재 예제의 책임도

세 성분의 $\pi_k$가 모두 $\frac13$이라 (11.17)의 분자·분모에서 약분된다. 그래서 $r_{nk}=\frac{\mathcal N_k}{\mathcal N_1+\mathcal N_2+\mathcal N_3}$만 계산하면 된다. 정규분포의 지수는 $-\frac{(x-\mu)^2}{2\sigma^2}$이다.

**$x=-1$:**
- $\mathcal N(-1\mid-4,1)=0.3989\,e^{-9/2}=0.3989(0.01111)=0.004432$
- $\mathcal N(-1\mid0,0.2)=0.8921\,e^{-1/0.4}=0.8921(0.08208)=0.07322$
- $\mathcal N(-1\mid8,3)=0.2303\,e^{-81/6}=0.2303(1.37\times10^{-6})\approx3.2\times10^{-7}$

합 $0.07765$.

**답:** $r=(0.057,\ 0.943,\ 0.000)$

**$x=2$:**
- $\mathcal N(2\mid-4,1)=0.3989\,e^{-18}\approx6.1\times10^{-9}$
- $\mathcal N(2\mid0,0.2)=0.8921\,e^{-4/0.4}=0.8921(4.54\times10^{-5})=4.05\times10^{-5}$
- $\mathcal N(2\mid8,3)=0.2303\,e^{-36/6}=0.2303(0.002479)=5.709\times10^{-4}$

합 $6.114\times10^{-4}$.

**답:** $r=(0.000,\ 0.066,\ 0.934)$

둘 다 교재 (11.19)와 같다. $x=2$는 성분 2의 평균 0에 더 가깝지만(거리 2 대 6), 성분 2는 분산이 0.2로 좁아서 표준편차 단위로는 $2/\sqrt{0.2}\approx4.5$배, 성분 3은 $6/\sqrt3\approx3.5$배 떨어져 있다. 그래서 성분 3이 책임을 더 진다.

---

### 11-2. 교재 예제의 M 단계 한 번

**(a)** 열마다 더한다.
- $N_1=1+1+0.057+0.001=2.058$
- $N_2=0.943+0.999+0.066=2.008$
- $N_3=0.934+1+1=2.934$

합 $7=N$ (행마다 책임도 합이 1이므로).

**(b)** (11.20) $\mu_k=\frac1{N_k}\sum_nr_{nk}x_n$:
- $\mu_1=\frac{-3-2.5+0.057(-1)+0.001(0)}{2.058}=\frac{-5.557}{2.058}\approx-2.700$
- $\mu_2=\frac{0.943(-1)+0.999(0)+0.066(2)}{2.008}=\frac{-0.811}{2.008}\approx-0.404$
- $\mu_3=\frac{0.934(2)+4+5}{2.934}=\frac{10.868}{2.934}\approx3.704$

**(c)** (11.30)의 1차원판 $\sigma_k^2=\frac1{N_k}\sum_nr_{nk}(x_n-\mu_k)^2$, **새 평균** 사용(교재 (11.54)~(11.55) 옆 주석).
- $\sigma_1^2$: 항 $0.0899,\ 0.0401,\ 0.057(1.700)^2=0.1648,\ 0.001(2.700)^2=0.0073$, 합 $0.3020$ → $\frac{0.3020}{2.058}\approx0.147$
- $\sigma_2^2$: 항 $0.943(0.596)^2=0.3351,\ 0.999(0.404)^2=0.1630,\ 0.066(2.404)^2=0.3814$, 합 $0.8795$ → $\frac{0.8795}{2.008}\approx0.438$
- $\sigma_3^2$: 항 $0.934(1.704)^2=2.7125,\ (0.296)^2=0.0875,\ (1.296)^2=1.6792$, 합 $4.4792$ → $\frac{4.4792}{2.934}\approx1.527$

**(d)** (11.42) $\pi_k=N_k/N$: $\frac{2.058}7\approx0.294$, $\frac{2.008}7\approx0.287$, $\frac{2.934}7\approx0.419$.

**(e)** 평균 $-2.7,-0.4,3.7$과 비율 $0.29,0.29,0.42$는 교재와 같다. 분산은 $0.147$이 교재의 $0.14$와 조금 다른데, 표의 $x=0$ 행 $0.001$ 때문이다. 정확한 책임도는 $r_{41}\approx0.00015$이고, 반올림하지 않은 책임도로 계산하면 $\sigma_1^2\approx0.144$로 교재 값이 나온다. 나머지 둘($0.438\approx0.44$, $1.527\approx1.53$)은 같다. 로그 가능도는 $-28.3$에서 $-14.4$로 늘어난다(교재 예제 11.5 끝).

---

### 11-3. 갱신식 유도: 평균과 분산

**(a)** 로그 가능도 (11.10)은 $L=\sum_n\log p(x_n\mid\theta)$, $p(x_n\mid\theta)=\sum_j\pi_j\mathcal N(x_n\mid\mu_j,\Sigma_j)$이다. 로그의 미분 (11.15)로

$$
\frac{\partial L}{\partial\mu_k}=\sum_n\frac{1}{p(x_n\mid\theta)}\frac{\partial p(x_n\mid\theta)}{\partial\mu_k}.
$$

합 안에서 $\mu_k$를 가진 것은 $k$번째 항뿐이다. 가우시안 지수 $-\frac12(x-\mu)^\top\Sigma^{-1}(x-\mu)$를 $\mu$로 미분하면 $(x-\mu)^\top\Sigma^{-1}$이므로 (11.21)

$$
\begin{aligned}
\frac{\partial p(x_n\mid\theta)}{\partial\mu_k}&=\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)\\
&\quad\cdot(x_n-\mu_k)^\top\Sigma_k^{-1}.
\end{aligned}
$$

대입하면 분수 부분이 정확히 $r_{nk}$ (11.17)이다 (11.22).

$$
\frac{\partial L}{\partial\mu_k}=\sum_nr_{nk}(x_n-\mu_k)^\top\Sigma_k^{-1}=0^\top.
$$

오른쪽에서 $\Sigma_k$를 곱하면 $\sum_nr_{nk}x_n=\mu_k\sum_nr_{nk}=N_k\mu_k$.

**답:** $\mu_k^{\text{new}}=\frac1{N_k}\sum_nr_{nk}x_n$ (11.20)

**(b)** 오른쪽의 $r_{nk}$가 $\mu_k$를 포함한 모든 매개변수에 의존한다. 식의 양쪽에 $\mu_k$가 있는 셈이라 한 번에 풀리지 않는다. 그래서 $r_{nk}$를 현재 값으로 고정하고 갱신하는 일을 반복한다(EM). 교재 11.3절 첫 문장이 이 이야기다.

**(c)** 1차원 로그 밀도 $\log\mathcal N(x\mid\mu,\sigma^2)=-\frac12\log2\pi-\frac12\log\sigma^2-\frac{(x-\mu)^2}{2\sigma^2}$를 $\sigma^2$로 미분하면 $-\frac1{2\sigma^2}+\frac{(x-\mu)^2}{2\sigma^4}$이다. (a)와 같은 과정으로

$$
\begin{aligned}
&\frac{\partial L}{\partial\sigma_k^2}\\
&=\sum_nr_{nk}\Big(-\frac1{2\sigma_k^2}+\frac{(x_n-\mu_k)^2}{2\sigma_k^4}\Big)=0.
\end{aligned}
$$

$2\sigma_k^4$를 곱하면 $\sum_nr_{nk}\big(-\sigma_k^2+(x_n-\mu_k)^2\big)=0$, 즉 $N_k\sigma_k^2=\sum_nr_{nk}(x_n-\mu_k)^2$.

**답:** $\sigma_k^{2,\text{new}}=\frac1{N_k}\sum_nr_{nk}(x_n-\mu_k)^2$ ((11.30)의 1차원판)

---

### 11-4. 혼합 비율 갱신: 라그랑주 승수

**(a)** (11.43):

$$
\begin{aligned}
\mathfrak L&=\sum_n\log\sum_k\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)\\
&\quad+\lambda\Big(\sum_k\pi_k-1\Big).
\end{aligned}
$$

**(b)** $\pi_k$로 미분하면 (11.44)

$$
\frac{\partial\mathfrak L}{\partial\pi_k}=\sum_n\frac{\mathcal N(x_n\mid\mu_k,\Sigma_k)}{\sum_j\pi_j\mathcal N(x_n\mid\mu_j,\Sigma_j)}+\lambda.
$$

합 안의 분수는 $r_{nk}/\pi_k$이므로 첫 항은 $N_k/\pi_k$이다. 0으로 놓으면 $\pi_k=-N_k/\lambda$ (11.46).

**(c)** 제약 $\sum_k\pi_k=1$에 넣으면 $-\frac{\sum_kN_k}\lambda=1$. 각 $n$에서 $\sum_kr_{nk}=1$이므로 $\sum_kN_k=N$이고 $\lambda=-N$ (11.47)~(11.48).

**답:** $\pi_k=\frac{N_k}N$ (11.49). 성분 $k$가 맡은 "유효 데이터 수"의 비율이다.

---

### 11-5. 잠재변수 관점과 결정 경계

**(a)** $z=[z_1,z_2]^\top$은 원-핫(하나만 1). $p(z_k=1)=\pi_k$ (11.59)~(11.60), $p(x\mid z_k=1)=\mathcal N(x\mid\mu_k,\sigma_k^2)$ (11.58). $z$의 가능한 값 두 개에 대해 더하면 (11.65)~(11.66)

$$
\begin{aligned}
p(x)&=\sum_kp(x\mid z_k=1)p(z_k=1)\\
&=\sum_k\pi_k\mathcal N(x\mid\mu_k,\sigma_k^2).
\end{aligned}
$$

GMM이 그대로 나온다.

**(b)** $x=1$은 두 평균 0과 2에서 같은 거리이고 분산도 같아 $\mathcal N(1\mid0,1)=\mathcal N(1\mid2,1)\approx0.2420$이다.

$$
\begin{aligned}
&p(z_1=1\mid x=1)\\
&=\frac{0.6(0.2420)}{0.6(0.2420)+0.4(0.2420)}=0.6.
\end{aligned}
$$

**답:** $0.6=\pi_1$. 가능도 비가 1이라 데이터가 어느 쪽 편도 들지 않으므로, 사후확률이 사전확률 그대로다.

**(c)** $0.6e^{-x^2/2}=0.4e^{-(x-2)^2/2}$. 로그를 취해 정리하면

$$
\begin{aligned}
\log1.5&=\frac{x^2-(x-2)^2}2\\
&=\frac{4x-4}2=2x-2.
\end{aligned}
$$

**답:** $x=1+\frac{\log1.5}2\approx1.203$. 비율이 큰 성분 1이 경계를 성분 2 쪽으로 밀어낸다.

---

### 11-6. EM 한 바퀴: 잘 갈라진 데이터

**(a)** $\pi$와 분산이 같으니 약분하면

$$
\begin{aligned}
r_{n1}&=\frac{e^{-(x-1)^2/2}}{e^{-(x-1)^2/2}+e^{-(x-5)^2/2}}\\
&=\frac1{1+e^{4x-12}}.
\end{aligned}
$$

($(x-1)^2-(x-5)^2=8x-24$를 2로 나눈 것이 $4x-12$다.)

| $x_n$ | $4x-12$ | $r_{n1}$ | $r_{n2}$ |
|---|---|---|---|
| 0 | $-12$ | $0.999994$ | $0.000006$ |
| 1 | $-8$ | $0.999665$ | $0.000335$ |
| 5 | $8$ | $0.000335$ | $0.999665$ |
| 6 | $12$ | $0.000006$ | $0.999994$ |

**(b)**
- $N_1=N_2=2.000$ (대칭)
- $\mu_1$: 분자 $\sum_nr_{n1}x_n=0(0.999994)+1(0.999665)+5(0.000335)+6(0.000006)=1.00138$을 $N_1=2$로 나누어 $\mu_1\approx0.5007$, 대칭으로 $\mu_2=6-0.5007=5.4993$
- $\sigma_1^2=\frac12\big[0.999994(0.5007)^2+0.999665(0.4993)^2+0.000335(4.4993)^2+0.000006(5.4993)^2\big]=\frac{0.2507+0.2492+0.0068+0.0002}2\approx0.2534$, 대칭으로 $\sigma_2^2\approx0.2534$
- $\pi=(0.5,\ 0.5)$

**(c)** 교재 11.3절: EM의 매 단계는 로그 가능도를 늘린다(Neal and Hinton, 1999). 이 예에서는 M 단계가 분산을 1에서 0.25로 줄여 두 점씩 모인 덩어리에 밀도를 집중시켰기 때문에 데이터 위의 밀도가 커졌다.

**(d)** 책임도가 거의 0 또는 1이므로 $\mu_k$는 거의 "그 성분에 배정된 점들의 평균" $\frac{0+1}2=0.5$, $\frac{5+6}2=5.5$이다. 이것이 K-평균의 **중심 갱신** 단계다. E 단계는 각 점을 가장 가까운 평균에 배정하는 K-평균의 **배정** 단계에 해당한다. 교재 11.5절은 "GMM의 평균을 군집 중심으로 보고 공분산을 무시(단위행렬로)하면 K-평균이 되며, K-평균은 딱 잘라 배정하고 GMM은 책임도로 부드럽게 배정한다"고 적는다. (**교재 밖 보충:** 모든 성분의 공분산을 $\sigma^2I$로 같게 두고 $\sigma^2\to0$으로 보내면 책임도가 정확히 0/1이 되어 K-평균과 같아진다.)

---

### 11-7. 최대가능도의 특이점

**(a)** 로그 밀도 항은 둘 다 양수인 두 항의 합의 로그이므로 한 항보다 크다.

$$
\begin{aligned}
&\log\big[0.5\mathcal N(0\mid0,\varepsilon)\\
&\qquad+0.5\mathcal N(0\mid3,10)\big]\\
&\ge\log0.5-\tfrac12\log(2\pi\varepsilon).
\end{aligned}
$$

$\varepsilon\to0$이면 $-\frac12\log\varepsilon\to+\infty$이므로 이 항은 $+\infty$로 간다.

**(b)** $x\in\{1,5,6\}$의 항은 $\log\big[0.5\mathcal N(x\mid3,10)\big]$ 이상이고, 이 값은 $\varepsilon$과 무관한 유한한 수다(예: $x=1$이면 약 $-2.96$). 합하면 "$+\infty$로 가는 항 + 아래로 유계인 항들"이므로 전체 로그 가능도 $\to+\infty$다. 수치로는 $\varepsilon=10^{-2}$에서 $-8.43$, $10^{-4}$에서 $-6.15$이고, 이후 $\varepsilon$이 줄 때마다 끝없이 커진다. 최대가능도 해가 존재하지 않는다.

**(c)** 교재 11.5절: GMM에서도 최대가능도는 심한 과적합을 겪을 수 있으며, 성분의 평균이 데이터 점 하나와 같아지고 공분산이 0으로 가면 가능도가 무한대가 된다. 이 성분은 점 하나에 무한한 밀도를 주지만 분포의 모양에 대해서는 아무것도 말해 주지 않는다. 교재는 사전분포를 두는 베이즈 접근을 대안으로 언급한다. (**교재 밖 보충:** 실제로는 분산에 하한을 두거나 공분산에 작은 $\epsilon I$를 더하고, 무너진 성분은 다시 초기화하며, 공분산에 사전분포를 둔 MAP-EM을 쓴다.)

---

### 11-8. EM과 GMM 개념

**(a)** 베이즈 정리:

$$
\begin{aligned}
&p(z_{nk}=1\mid x_n)\\
&=\frac{p(x_n\mid z_{nk}=1)\,p(z_{nk}=1)}{\sum_jp(x_n\mid z_{nj}=1)\,p(z_{nj}=1)}\\
&=\frac{\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)}{\sum_j\pi_j\mathcal N(x_n\mid\mu_j,\Sigma_j)}.
\end{aligned}
$$

이 값이 $r_{nk}$ (11.72)다. 책임도는 "이 점을 $k$번 성분이 만들었을 사후확률"이다.

**(b)**
- **E 단계:** 매개변수 $\theta^{(t)}$를 고정하고 책임도 $r_{nk}$(잠재변수의 사후분포)를 계산한다.
- **M 단계:** 책임도를 고정하고 매개변수를 갱신한다. 일반적으로는 기대 완전 데이터 로그 가능도 $Q(\theta\mid\theta^{(t)})$ (11.73)을 최대화하고, GMM에서는 (11.54)~(11.56)이 된다.

**(c)** GMM 로그 가능도는 오목하지 않아 봉우리가 여러 개다(성분 번호만 바꾼 해도 모두 같은 값이다). EM은 매 단계 로그 가능도를 늘리는 국소적 방법이라 시작점 근처의 봉우리에 멈출 수 있다. (**교재 밖 보충:** 초기값을 여러 번 바꿔 돌린 뒤 로그 가능도가 가장 큰 해를 고르거나, K-평균 결과로 초기화한다.)

**(d)** 가우시안 하나일 때는 $\log\prod_n\mathcal N(x_n\mid\mu,\Sigma)=\sum_n\log\mathcal N(\cdots)$이고, 로그가 지수를 풀어 이차식의 합이 되므로 표본 평균·공분산이라는 닫힌 해가 나온다. GMM은 $\sum_n\log\sum_k\pi_k\mathcal N(\cdots)$처럼 **로그 안에 합**이 있어 로그가 지수를 풀지 못한다. 미분하면 모든 성분이 $r_{nk}$로 얽혀 닫힌 해가 없다.

---

## 12장 SVM

### 12-1. 초평면까지의 거리와 크기 조정

**(a)** $\|w\|=\sqrt{9+16}=5$.
- $(3,4)$: $f=9+16-5=20$, 거리 $\frac{20}5=4$ (양의 쪽)
- $(0,0)$: $f=-5$, 거리 $-1$ (음의 쪽, 거리 1)
- $(1,0.5)$: $f=3+2-5=0$, 초평면 위

**(b)** $\{x:6x_1+8x_2-10=0\}=\{x:2(3x_1+4x_2-5)=0\}$이므로 같은 집합이다. 그런데 $f$ 값은 두 배가 되어, 예를 들어 $(3,4)$의 $yf$가 20에서 40이 된다. 부호 있는 거리 $f/\|w\|=40/10=4$는 그대로다.

**(c)** $(w,b)$의 크기는 마음대로 정할 수 있으므로 가장 가까운 점에서 $y_n(\langle w,x_n\rangle+b)=1$이 되게 고정한다 (12.15). 마진 위의 점 $x_a$를 초평면에 직교사영한 점을 $x_a'$이라 하면 $x_a=x_a'+r\frac{w}{\|w\|}$ (12.8), $\langle w,x_a'\rangle+b=0$ (12.11)이다. $x_a'$을 대입하면 (12.12)~(12.13)

$$
\langle w,x_a\rangle+b-r\frac{\langle w,w\rangle}{\|w\|}=0.
$$

$\langle w,x_a\rangle+b=1$이고 $\frac{\langle w,w\rangle}{\|w\|}=\|w\|$이므로 $1-r\|w\|=0$.

**답:** $r=\frac1{\|w\|}$ (12.14). 마진을 최대로 하는 것은 $\|w\|$를 최소로 하는 것과 같고, 미분하기 쉽게 $\frac12\|w\|^2$를 최소화한다 (12.18).

---

### 12-2. 하드 마진 SVM: 눈에 보이는 답이 최적이 아닐 때

**(a)** $f(x)=x_1-1$.
- 양성 $(2,2)$, $(2,3)$: $f=1$, $yf=1\ge1$
- 음성 $(0,0)$, $(0,1)$: $f=-1$, $yf=1\ge1$

**답:** 모든 제약을 만족하고 마진은 $\frac1{\|w\|}=1$이다.

**(b)** 양성의 볼록 껍질은 선분 $\{(2,t):2\le t\le3\}$, 음성은 $\{(0,s):0\le s\le1\}$이다. 두 점 사이 거리의 제곱은 $4+(t-s)^2$이고, $t-s\ge2-1=1$이므로 $t=2$, $s=1$에서 최소다.

가장 가까운 두 점은 $c=(2,2)$, $d=(0,1)$이고 거리는 $\sqrt5$다. 12.3.2절 (12.44)처럼 $w$는 $c-d=(2,1)$ 방향이다. 최대 마진 초평면은 선분 $cd$의 수직이등분선, 즉 중점 $(1,\ 1.5)$를 지나고 법선이 $(2,1)$인 직선 $2x_1+x_2=3.5$이다.

크기 맞추기: $w=k(2,1)$, $b=-3.5k$로 두면 $f(c)=k(4+2-3.5)=2.5k=1$, $k=0.4$.

**답:** $w=(0.8,\ 0.4)$, $b=-1.4$

모든 제약 확인: $(2,2)$: $1.6+0.8-1.4=1$, $(2,3)$: $1.6+1.2-1.4=1.4$, $(0,0)$: $yf=1.4$, $(0,1)$: $f=0.4-1.4=-1$이라 $yf=1$. 모두 1 이상.

**(c)** $\|w\|=\sqrt{0.64+0.16}=\sqrt{0.8}\approx0.894$, 마진 $\frac1{0.894}\approx1.118=\frac{\sqrt5}2$ (껍질 사이 거리의 절반). (a)의 1보다 크다. (a)의 수직선은 제약은 만족하지만 최적이 아니다. 마진을 정하는 것은 가로로 마주 보는 쌍이 아니라 대각선으로 가장 가까운 쌍 $(2,2)$–$(0,1)$이다.

**(d)** 서포트 벡터는 마진 위의 두 점 $(2,2)$ ($y=+1$)와 $(0,1)$ ($y=-1$)이다. 나머지 두 점은 $yf=1.4>1$이라 $\alpha=0$이다. $\sum y_n\alpha_n=0$이므로 두 $\alpha$가 같다. 그 값을 $\alpha$라 하면 (12.38)로

$$
\begin{aligned}
w&=\alpha(2,2)-\alpha(0,1)\\
&=\alpha(2,1)=(0.8,\ 0.4).
\end{aligned}
$$

- $\alpha=0.4$
- (12.42): $b=y-\langle w,x\rangle=1-(1.6+0.8)=-1.4$ ($(0,1)$로 해도 $-1-0.4=-1.4$)
- 쌍대 목적(최대화형) $\sum\alpha_n-\frac12\|w\|^2=0.8-0.4=0.4$
- 원 목적 $\frac12\|w\|^2=0.4$

**답:** $\alpha=0.4$ (두 서포트 벡터), 나머지 0. 쌍대 목적값과 원 목적값이 0.4로 같다(강쌍대성). 원 문제의 해가 KKT 조건(제약 만족, $\alpha\ge0$, 활성 제약에만 $\alpha>0$, $w=\sum\alpha_ny_nx_n$, $\sum\alpha_ny_n=0$)을 모두 만족하므로 이 $\alpha$가 쌍대 최적해다.

---

### 12-3. 소프트 마진 쌍대 유도

**(a)** 제약 (12.26b) $y_n(\langle w,x_n\rangle+b)\ge1-\xi_n$에 $\alpha_n\ge0$, 제약 (12.26c) $\xi_n\ge0$에 $\gamma_n\ge0$을 붙인다 (12.34).

$$
\begin{aligned}
L&=\frac12\|w\|^2+C\sum_n\xi_n-\sum_n\gamma_n\xi_n\\
&\quad-\sum_n\alpha_n\big(y_n(\langle w,x_n\rangle+b)\\
&\qquad\qquad-1+\xi_n\big).
\end{aligned}
$$

**(b)** (12.35)~(12.37):
- $\frac{\partial L}{\partial w}=w^\top-\sum_n\alpha_ny_nx_n^\top$
- $\frac{\partial L}{\partial b}=-\sum_n\alpha_ny_n$
- $\frac{\partial L}{\partial\xi_n}=C-\alpha_n-\gamma_n$

**(c)** 셋을 0으로 놓으면 $w=\sum_n\alpha_ny_nx_n$ (12.38), $\sum_n\alpha_ny_n=0$, $\gamma_n=C-\alpha_n$이다. $L$에 대입해 항별로 정리한다.
- $\frac12\|w\|^2=\frac12\sum_i\sum_jy_iy_j\alpha_i\alpha_j\langle x_i,x_j\rangle$
- $-\sum_i\alpha_iy_i\langle w,x_i\rangle=-\sum_i\sum_jy_iy_j\alpha_i\alpha_j\langle x_i,x_j\rangle$
- $-b\sum_i\alpha_iy_i=0$
- $+\sum_i\alpha_i$
- $\xi$ 항: $\sum_i(C-\alpha_i-\gamma_i)\xi_i=0$

모두 더하면 (12.40):

$$
\begin{aligned}
\mathfrak D(\alpha)&=\sum_i\alpha_i\\
&\quad-\frac12\sum_i\sum_jy_iy_j\alpha_i\alpha_j\langle x_i,x_j\rangle.
\end{aligned}
$$

쌍대 문제는 이를 최대화하는 것이고, 부호를 바꾸면 (12.41):

$$
\min_\alpha\ \frac12\sum_{i,j}y_iy_j\alpha_i\alpha_j\langle x_i,x_j\rangle-\sum_i\alpha_i.
$$

조건은 $\sum_iy_i\alpha_i=0$, $0\le\alpha_i\le C$다.

**(d)** $\alpha_i\ge0$은 부등식 제약의 라그랑주 승수라서 생긴다. $\gamma_i=C-\alpha_i$이고 $\gamma_i\ge0$이어야 하므로 $\alpha_i\le C$다. 이 "상자 제약"이 소프트 마진의 흔적이다.

**(e)** 하드 마진에는 $\xi$와 $\gamma$가 없어 위 상한이 없고 $\alpha_i\ge0$만 남는다. 목적함수 모양은 같다. $C\to\infty$이면 소프트 마진 쌍대가 하드 마진 쌍대가 된다.

---

### 12-4. 힌지 손실과 여유 변수

$f(x)=x_1-x_2$, 힌지 손실 $\max\{0,1-t\}$ (12.28), 최적 여유 변수 $\xi_n=\max\{0,1-t_n\}$ ((12.32)~(12.33)).

**(a), (b)**

| 점 | $f(x_n)$ | $t_n=y_nf$ | 힌지 $=\xi_n$ | 위치 |
|---|---|---|---|---|
| 1 $(3,1)$, $+1$ | 2 | 2 | 0 | 마진 밖(올바른 쪽, 여유 있음) |
| 2 $(1,0)$, $+1$ | 1 | 1 | 0 | 마진 경계 위 |
| 3 $(0,0.5)$, $-1$ | $-0.5$ | 0.5 | 0.5 | 마진 안(올바른 쪽) |
| 4 $(2,1)$, $-1$ | 1 | $-1$ | 2 | 잘못 분류 |

규칙: $t\ge1$이면 손실 0, $0\le t<1$이면 맞게 분류했지만 마진 안, $t<0$이면 잘못 분류.

**(c)** (12.31): $\frac12\|w\|^2+C\sum_n\max\{0,1-t_n\}=\frac12(1+1)+1\cdot(0+0+0.5+2)$.

**답:** $1+2.5=3.5$

**(d)** 0-1 손실(틀리면 1)은 $0,0,0,1$로 합 1이다. 힌지는 모든 $t$에서 0-1 손실 이상이다. $t\ge1$이면 둘 다 0이고, $0\le t<1$이면 힌지 $1-t>0$, $t<0$이면 힌지 $1-t>1$이다. 교재 그림 12.8: 힌지 손실은 0-1 손실의 **볼록한 상한**이다. 0-1 손실을 직접 최소화하면 조합 최적화 문제가 되어 어렵기 때문에(12.2.5절) 힌지로 바꾼다.

---

### 12-5. 커널로 XOR 풀기

**(a)** 양성의 볼록 껍질은 $(1,1)$과 $(-1,-1)$을 잇는 선분이고 원점을 지난다. 음성의 껍질도 $(1,-1)$과 $(-1,1)$을 잇는 선분이라 원점을 지난다. 두 껍질이 원점에서 만나므로 분리 초평면이 없다. 식으로는 $f$가 아핀이라 $f(0)=\frac12f(1,1)+\frac12f(-1,-1)>0$이면서 동시에 $f(0)=\frac12f(1,-1)+\frac12f(-1,1)<0$이어야 하므로 모순이다.

**(b)** 전개한다.

$$
\begin{aligned}
(x^\top x')^2&=(x_1x_1'+x_2x_2')^2\\
&=x_1^2x_1'^2+2x_1x_2x_1'x_2'+x_2^2x_2'^2.
\end{aligned}
$$

이는 $\langle(x_1^2,\sqrt2x_1x_2,x_2^2),\ (x_1'^2,\sqrt2x_1'x_2',x_2'^2)\rangle$와 같다. 숫자 확인: $x^\top x'=3-2=1$이라 $k=1$. $\phi(x)=(1,\ 2\sqrt2,\ 4)$, $\phi(x')=(9,\ -3\sqrt2,\ 1)$, 내적 $9-12+4=1$. 같다.

**(c)** 원래 내적: 같은 쌍 $(1,1)\cdot(-1,-1)=-2$, $(1,-1)\cdot(-1,1)=-2$, 자기 자신 2, 다른 부호끼리 0. 제곱하면

$$
K=\begin{bmatrix}4&4&0&0\\4&4&0&0\\0&0&4&4\\0&0&4&4\end{bmatrix}.
$$

**답:** 고유값 $8,8,0,0\ge0$. $z^\top Kz=4(z_1+z_2)^2+4(z_3+z_4)^2\ge0$이므로 양의 준정부호다 (12.53).

**(d)** $\phi(1,1)=\phi(-1,-1)=(1,\sqrt2,1)$, $\phi(1,-1)=\phi(-1,1)=(1,-\sqrt2,1)$. 특징 공간에서는 점이 두 개뿐이고 거리는 $2\sqrt2$다. 최대 마진은 그 절반 $\sqrt2$이고, 초평면은 두 점의 수직이등분면이다. 법선은 $(0,1,0)$ 방향이고 중점 $(1,0,1)$을 지나므로 $b=0$이다. $w=(0,w_2,0)$으로 두면 $yf=\sqrt2w_2=1$에서 $w_2=\frac1{\sqrt2}$.

**답:** $w=(0,\frac1{\sqrt2},0)$, $b=0$, 마진 $\frac1{\|w\|}=\sqrt2$. 결정 함수 $f(x)=\frac1{\sqrt2}\cdot\sqrt2x_1x_2=x_1x_2$. 1·3사분면이 양성, 2·4사분면이 음성이다.

**(e)** 네 점 모두 마진 위($yf=1$)라 서포트 벡터다. 대칭성으로 모든 $\alpha_n=\alpha$로 두면 $\sum y_n\alpha_n=0$이 성립하고

$$
\begin{aligned}
w&=\sum_n\alpha y_n\phi(x_n)\\
&=\alpha\big[2(1,\sqrt2,1)-2(1,-\sqrt2,1)\big]\\
&=\alpha(0,\ 4\sqrt2,\ 0).
\end{aligned}
$$

$\frac1{\sqrt2}=4\sqrt2\alpha$에서 $\alpha=\frac18$. 커널만으로 쓰면

$$
\begin{aligned}
f(x)&=\tfrac18\big[2(x_1+x_2)^2-2(x_1-x_2)^2\big]\\
&=\tfrac18\cdot8x_1x_2=x_1x_2.
\end{aligned}
$$

(d)와 같다. 쌍대 값 $\sum\alpha-\frac12\|w\|^2=0.5-0.25=0.25=\frac12\|w\|^2$도 맞는다. 양성 두 점이 특징 공간에서 같은 점이라 $\alpha$를 둘 사이에 나누는 방법은 여럿이지만(합만 정해진다), $w$와 $f$는 하나로 정해진다.

**(f)** 1차원 점 $0$, $1$: $k(0,0)=0$, $k(1,1)=0$, $k(0,1)=-1$이므로 $K=\begin{bmatrix}0&-1\\-1&0\end{bmatrix}$. $z=(1,1)$이면 $z^\top Kz=-2<0$.

**답:** 그람 행렬이 양의 준정부호가 아니므로 (12.53)을 어겨 커널이 될 수 없다. 고유값도 $\pm1$이다.

---

### 12-6. $C$와 정규화 계수 $\lambda$의 관계

**(a)** (12.31)을 양수 $CN$으로 나누어도 최소점은 같다.

$$
\begin{aligned}
&\frac1N\sum_n\max\{0,1-y_nf(x_n)\}\\
&+\frac1{2CN}\|w\|^2.
\end{aligned}
$$

앞은 힌지 손실의 경험적 위험 (8.6), 뒤는 (8.12) 꼴의 정규화항이다.

**답:** $\lambda=\frac1{2CN}$. SVM은 "힌지 손실 + $L_2$ 정규화"의 경험적 위험 최소화다. 교재 8.2.3절의 "정규화항은 큰 마진과 같은 생각"이라는 말이 이것이다.

**(b)** $C$가 크면 $\lambda$가 작다. 마진 위반에 큰 벌을 주므로 마진이 좁아지고 훈련 오류가 줄지만 과적합 위험이 있다. $C$가 작으면 $\lambda$가 크다. $\|w\|$를 작게(마진을 넓게) 하고 위반을 더 허용하므로 단순해지지만 과소적합할 수 있다.

**(c)** $C\to\infty$이면 $\xi_n>0$이 무한히 비싸 $\xi_n=0$이 강제된다. 하드 마진 (12.18)이 되고, 선형 분리가 불가능한 데이터에서는 해가 없다.

---

### 12-7. 커널 SVM으로 예측하기

$f(x)=k(x_1,x)-k(x_2,x)=e^{-\frac12\|x\|^2}-e^{-\frac12\|x-(1,1)\|^2}$.

**(a)**
- $x_*=(0,1)$: $\|x\|^2=1$, $\|x-(1,1)\|^2=1$ → $f=e^{-0.5}-e^{-0.5}=0$, **경계 위**
- $x_*=(0,0.5)$: $0.25$와 $1.25$ → $f=e^{-0.125}-e^{-0.625}=0.8825-0.5353=0.347>0$, **$+1$**
- $x_*=(2,2)$: $8$과 $2$ → $f=e^{-4}-e^{-1}=0.0183-0.3679=-0.350<0$, **$-1$**

**(b)** $f=0$ ⇔ $\|x\|^2=\|x-(1,1)\|^2$ ⇔ $0=-2x_1-2x_2+2$.

**답:** 직선 $x_1+x_2=1$. 두 서포트 벡터의 수직이등분선이다($\alpha$가 같고 RBF가 거리에만 의존하므로).

**(c)** 교재 12.4절: 가우시안 RBF 커널의 특징 공간은 무한 차원이라 특징을 명시적으로 쓸 수 없고, 커널로 유사도만 계산할 수 있다. 쌍대 해와 (12.38) $w=\sum_n\alpha_ny_n\phi(x_n)$ 덕분에 $\langle w,\phi(x)\rangle=\sum_n\alpha_ny_nk(x_n,x)$로 예측하므로 $w$ 자체는 필요 없다.

---

### 12-8. SVM 개념

**(a)** (12.38) 뒤 Remark: $\alpha_n>0$인 점이 서포트 벡터이고, 초평면을 "떠받친다". $w=\sum\alpha_ny_nx_n$에는 $\alpha_n>0$인 점만 들어가고, $b$도 마진 위의 점으로 정한다. $\alpha_n=0$인 점은 제약이 느슨해서($y_nf\ge1$) 지워도 남은 문제에서 같은 $(w,b)$가 KKT 조건을 모두 만족한다. 그러니 해가 그대로다.

**(b)** (교재 12.3.1절 여백 주석, KKT 조건)
- $0<\alpha_n<C$: $\gamma_n=C-\alpha_n>0$이므로 $\gamma_n\xi_n=0$에서 $\xi_n=0$. 또 $\alpha_n>0$이라 제약이 등호로 성립해 $y_nf(x_n)=1$이다. **정확히 마진 경계 위**의 점이다. 그래서 (12.42)로 $b$를 구할 때 이런 점을 쓴다.
- $\alpha_n=C$: $\gamma_n=0$이라 $\xi_n>0$일 수 있다. $y_nf=1-\xi_n\le1$이므로 **마진 안이나 잘못 분류된** 점이다(경계 위일 수도 있다).
- $\alpha_n=0$: $y_nf\ge1$, 마진 밖이나 경계 위.

**(c)**
1. 쌍대는 데이터를 내적 $\langle x_i,x_j\rangle$으로만 쓰므로, 이를 커널 $k(x_i,x_j)$로 바꿔 비선형 분류를 할 수 있다(12.4절).
2. 변수 수가 $N$개($\alpha$)이고 제약이 상자 꼴 $0\le\alpha_i\le C$라 다루기 쉽다. 특징 차원 $D$가 데이터 수보다 클 때 특히 유리하다.

**(d)** 목적함수 $\frac12\|w\|^2+C\sum\xi_n$은 양의 준정부호 이차식 + 일차식이라 볼록이다. 제약 $y_n(\langle w,x_n\rangle+b)\ge1-\xi_n$, $\xi_n\ge0$은 $(w,b,\xi)$에 대해 일차(아핀) 부등식이라 실현 가능 영역이 볼록이다. 따라서 볼록 이차계획 문제(교재 12.5절)이고, 국소 최적이 곧 전역 최적이다.

---

## OX 퀴즈 답

1. **X.** MML은 $\frac1N$로 나눈다 (10.1).
2. **X.** 교재 (8.48)의 AIC는 **큰** 값을 고른다. 작을수록 좋은 것은 $2M-2\log p$ 꼴이다(8-8 (d)).
3. **X.** MAP은 사후분포의 최빈값 하나, 즉 **점추정**이다(8.3.2절: 사전분포를 쓰지만 여전히 점추정만 준다).
4. **O.** (9.31)~(9.34).
5. **X.** 사후 예측 분산은 $\phi^\top S_N\phi+\sigma^2\ge\sigma^2$이다 (9.57c). 노이즈는 데이터가 아무리 많아도 줄지 않는다.
6. **X.** 반대다. 머리-머리 노드 $d$(또는 그 자손)를 관측하면 $a$와 $c$ 사이에 의존이 **생긴다** (8.38, 설명해 없애기).
7. **X.** **가장 큰** 고유값의 고유벡터다 (10.15).
8. **O.** (10.44).
9. **O.** 각 $n$에서 $r_{n\cdot}$는 확률 벡터다(11.2절).
10. **X.** 매 단계 로그 가능도를 늘리지만 국소 최댓값에 멈출 수 있다(11-8 (c)).
11. **O.** (12.14)~(12.18).
12. **O.** (12.38).
13. **O.** (12.53).
14. **X.** 반대다. 9장은 $N\times D$, 10장은 $D\times N$ (10.46 옆 설명).
15. **X.** 증거는 쓸데없이 복잡한 모델에 자동으로 벌점을 준다(8.6.2절, 그림 8.14, 9-6).
