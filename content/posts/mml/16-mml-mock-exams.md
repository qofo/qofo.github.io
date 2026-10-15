---
title: "MML 실전 모의고사: 기초수학·기초 AI 60분 세트"
slug: "mml-mock-exams"
date: 2026-10-15
weight: 16
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "머신러닝 수학", "모의고사", "선형대수", "확률", "최적화", "선형회귀", "PCA", "GMM", "SVM"]
description: "MML Part 1(2~7장)과 Part 2(8~12장)를 각각 60분 안에 푸는 6문항짜리 모의고사. 기본 계산 위주의 A형(우리말)과 증명·유도 위주의 B형(영어 지문)을 과목마다 하나씩 만들었다. 답과 풀이는 다음 편에 있다."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재:** Deisenroth·Faisal·Ong, *Mathematics for Machine Learning* ([mml-book.github.io](https://mml-book.github.io/)에 공개된 PDF, 2024-01-15 판). 절과 식 번호는 그 PDF 기준이다.  
> **답과 풀이:** [다음 편](17-mml-mock-exam-solutions.md)에 있다. 숫자 답은 모두 sympy·numpy로 검산했고, 풀이에 적은 교재 절·식 번호는 PDF 원문과 대조했다.  
> **범위와 시간:** 기초수학 = MML Part 1(2~7장) 60분, 기초 AI = MML Part 2(8~12장) 60분을 가정했다.

## 두 세트를 만든 이유

이 범위로 보는 필기시험의 응시 후기를 모아 보면, 1시간에 5~6문제가 나오고 교재의 기본 개념(정사영, 기울기 계산, 최적화 등)을 끝까지 계산할 수 있는지를 묻는 해가 많았다. 그런데 출제자가 해마다 바뀌어 체감 난이도가 크게 오른 해도 있었고, 같은 교재를 범위로 하는 다른 필기에서는 지문이 모두 영어이고 문제 대부분이 증명인 경우도 있었다. 그래서 과목마다 두 세트를 만들었다.

| 세트 | 가정 | 형식 |
|---|---|---|
| **A형** | 기본 개념을 끝까지 계산할 수 있는가를 묻는 해 | 우리말, 6문항, 계산 위주 |
| **B형** | 난이도가 오른 해 | **영어 지문**, 6문항, 증명·유도 비중 큼 |

## 쓰는 법

1. 타이머를 60분에 맞추고 빈 종이에 풀이 과정을 쓴다.
2. A형 두 세트를 먼저 푼다. 막힌 문제는 [풀이 편](17-mml-mock-exam-solutions.md)에서 그 문제만 찾아본다.
3. B형은 시간이 남을 때 푼다. 다 풀 필요는 없다. 문제마다 (a)만 풀거나 풀이를 읽기만 해도 영어 지문과 증명형 질문에 익숙해진다.
4. 시험 직전에는 새 문제 대신 틀린 문제의 풀이와 장별 글의 "시험 직전 10분 요약"을 본다.
5. 배점은 시간 배분용으로 임의로 정했다. 문항당 약 9분, 마지막 5분은 검토.

**표기(교재 관례):** 벡터는 열벡터, 스칼라 함수의 기울기는 **행벡터**(5장), 공분산의 분모는 $N$, $\log$는 자연로그. 9장의 데이터 행렬은 $N\times D$, 10장은 $D\times N$이다.

| 세트 | 문항 |
|---|---|
| [Part 1 A형](#part-1-a형-기초수학-60분-6문항) | 연립방정식·영공간, 정사영·그람-슈미트, 고윳값·촐레스키, 기울기·헤시안·테일러, 베이즈·분산·가우시안, 경사하강법·라그랑주 쌍대 |
| [Part 2 A형](#part-2-a형-기초ai-60분-6문항) | MLE·MAP, 그래프 모델·경험적 위험·AIC/BIC, 선형회귀·릿지, PCA, GMM의 EM 한 바퀴, 하드 마진 SVM·커널 |
| [Part 1 B형](#part-1-b형-basic-mathematics-60-min-6-problems-english) | 부분공간·기저 변환·랭크 증명, 내적·회전행렬, SVD·계수 1 근사, 행렬 미분·역전파, 이항분포·켤레·변수 변환, 정류점·KKT·젠센 |
| [Part 2 B형](#part-2-b형-basic-ai-60-min-6-problems-english) | 지수분포 MLE·릿지·LASSO, 베이즈 선형회귀, PCA 재구성 오차 증명·$N<D$, EM 갱신식 유도, 소프트 마진 SVM, 서술형 |
| [영어 용어 대조표](#영어-지문-용어-대조표) | 영어로 출제될 때 알아볼 낱말 |

---

## Part 1 A형: 기초수학 (60분, 6문항)

### 1-A1. 연립방정식, 랭크, 영공간 (15점) [2장]

$$
A=\begin{bmatrix}1&2&0&1\\2&4&1&4\\3&6&1&5\end{bmatrix},\qquad b=\begin{bmatrix}1\\3\\4\end{bmatrix}
$$

(a) 첨가행렬 $[A\mid b]$를 기약행 사다리꼴(RREF)로 만들고 $\operatorname{rank}(A)$를 구하라.
(b) $Ax=b$의 일반해를 "특수해 + 영공간" 꼴로 써라.
(c) 영공간 $\ker(A)$의 기저와 차원을 쓰고, 차원 정리(rank-nullity)를 확인하라.
(d) $b$를 $(1,3,5)^\top$로 바꾸면 해가 있는가? 한 줄로 이유를 써라.

### 1-A2. 정사영과 그람-슈미트 (15점) [3장]

$U=\operatorname{span}\{b_1,b_2\}$, $b_1=(1,1,0)^\top$, $b_2=(1,0,1)^\top$, $x=(0,3,3)^\top$.

(a) 사영행렬 $P=B(B^\top B)^{-1}B^\top$ ($B=[b_1\ b_2]$)와 $\pi_U(x)$를 구하라.
(b) $x$와 $U$ 사이의 거리를 구하라.
(c) 그람-슈미트로 $U$의 정규직교기저 $\{e_1,e_2\}$를 구하고, $\pi_U(x)=(e_1^\top x)e_1+(e_2^\top x)e_2$로 (a)를 검산하라.
(d) $P^2=P$, $P^\top=P$를 식으로 보여라. $P$의 고윳값은 무엇이어야 하는가?

### 1-A3. 고윳값 분해와 촐레스키 분해 (15점) [4장]

$$
A=\begin{bmatrix}4&1\\2&3\end{bmatrix},\qquad C=\begin{bmatrix}4&2\\2&5\end{bmatrix}
$$

(a) $A$의 고윳값과 고유벡터를 구하라.
(b) $A=PDP^{-1}$로 대각화하고 $A^n$을 $n$의 식으로 써라. $n=1$을 넣어 검산하라.
(c) $A$의 두 고유벡터는 서로 직교하는가? 스펙트럼 정리와 연결해 설명하라.
(d) $C$의 촐레스키 분해 $C=LL^\top$($L$은 대각 원소가 양수인 하삼각행렬)를 구하라.

### 1-A4. 기울기, 헤시안, 테일러 전개 (20점) [5장]

$f(x_1,x_2)=x_1^2x_2+e^{x_1x_2}$.

(a) 기울기 $\nabla f$(교재 관례대로 $1\times2$ 행벡터)를 구하고 점 $(1,0)$에서의 값을 구하라.
(b) $(1,0)$에서의 헤시안을 구하라.
(c) $(1,0)$ 근처의 2차 테일러 다항식을 $\delta=x-(1,0)^\top$로 써라.
(d) $g(x)=\|Ax-b\|^2$, $A=\begin{bmatrix}1&2\\0&1\\1&0\end{bmatrix}$, $b=(1,1,1)^\top$일 때 $\dfrac{dg}{dx}$를 행렬 식으로 쓰고 $x_0=(1,0)^\top$에서의 값을 구하라. $g$를 최소로 하는 $x$도 구하라.

### 1-A5. 베이즈 정리, 분산, 가우시안 (15점) [6장]

(a) 기계 A, B, C가 제품을 각각 50%, 30%, 20% 만들고 불량률은 1%, 2%, 5%다. 무작위로 고른 제품이 불량일 확률과, 불량품이 C에서 나왔을 확률을 구하라.
(b) 분산의 정의 $\mathbb V[x]=\mathbb E[(x-\mathbb E[x])^2]$에서 출발해 $\mathbb V[x]=\mathbb E[x^2]-(\mathbb E[x])^2$를 유도하라.
(c) $x=(x_1,x_2)^\top\sim\mathcal N(\mu,\Sigma)$, $\mu=(1,2)^\top$, $\Sigma=\begin{bmatrix}2&1\\1&2\end{bmatrix}$일 때 다음을 구하라.
 (i) 주변분포 $p(x_1)$ (ii) 조건부분포 $p(x_1\mid x_2=4)$ (iii) $y=x_1-x_2$의 분포 (iv) $\mathbb E[x_1x_2]$

### 1-A6. 경사하강법과 라그랑주 쌍대 (20점) [7장]

(a) $f(x)=\frac12x^\top Qx-b^\top x$, $Q=\operatorname{diag}(1,4)$, $b=(1,2)^\top$.
 (i) 최솟점 $x^*$를 구하라.
 (ii) $x_0=0$, 학습률 $\gamma=0.2$로 경사하강법을 두 번 진행해 $x_1,x_2$를 구하라.
 (iii) 오차 $e_k=x_k-x^*$가 $e_{k+1}=(I-\gamma Q)e_k$를 따름을 보이고, 수렴하는 $\gamma$의 범위와 가장 빨리 수렴하는 $\gamma$를 구하라.
(b) $\min\ x_1^2+x_2^2$ subject to $x_1+x_2\ge2$.
 (i) 제약을 $g(x)\le0$ 꼴로 바꾸고 라그랑지안을 써라.
 (ii) 쌍대 함수 $\mathfrak D(\lambda)=\min_x\mathfrak L(x,\lambda)$를 구하라.
 (iii) 쌍대 문제를 풀고, 원 문제의 최적값과 같음을 확인하라.

---

## Part 2 A형: 기초AI (60분, 6문항)

### 2-A1. MLE와 MAP (15점) [8장]

관측값 $2,4,3,7$이 $\mathcal N(\mu,\sigma^2)$에서 독립으로 나왔다.

(a) $\sigma^2=4$를 알 때 음의 로그 가능도 $\mathcal L(\mu)$를 쓰고 $\mu_{\text{ML}}$을 구하라.
(b) $\mu$와 $\sigma^2$를 모두 모를 때 $\sigma^2_{\text{ML}}$을 구하라.
(c) $\sigma^2=4$를 알고 사전분포가 $\mu\sim\mathcal N(0,1)$일 때 사후분포 $p(\mu\mid\mathcal X)$와 $\mu_{\text{MAP}}$을 구하라.
(d) 데이터가 아주 많아지면 $\mu_{\text{MAP}}$과 $\mu_{\text{ML}}$은 어떻게 되는가? 사후분포의 정밀도(분산의 역수)로 설명하라.

### 2-A2. 그래프 모델, 경험적 위험, 모델 선택 (15점) [8장]

(a) 방향 그래프 $a\to c\leftarrow b$, $c\to d$. 결합분포를 인수분해하고 다음이 성립하는지 판정하라.
 (i) $a\perp\!\!\!\perp b$ (ii) $a\perp\!\!\!\perp b\mid d$ (iii) $a\perp\!\!\!\perp d\mid c$
(b) 경험적 위험(empirical risk)을 식으로 정의하라. 경험적 위험을 최소화한 예측기가 과적합될 수 있는 이유를 쓰고, 정규화는 목적함수에 무엇을 더하는지 쓰라.
(c) 데이터 $N=50$개에 두 모델을 맞췄다. 모델 1은 매개변수 $M=3$개, 최대 로그 가능도 $-80$. 모델 2는 $M=6$개, $-75$. 교재 (8.48)의 AIC $\log p(x\mid\theta)-M$과 (8.49)의 BIC $\log p(x\mid\theta)-\frac12M\log N$으로 각각 어느 모델을 고르는가? ($\ln50\approx3.912$)

### 2-A3. 선형회귀 (20점) [9장]

데이터 $(x,y)$: $(0,1),\ (1,3),\ (2,4),\ (3,4)$. 모델 $y=\theta_0+\theta_1x+\epsilon$, $\epsilon\sim\mathcal N(0,\sigma^2)$, 특징 $\phi(x)=(1,x)^\top$.

(a) $\Phi$, $\Phi^\top\Phi$, $\Phi^\top y$를 구하고 $\theta_{\text{ML}}$을 구하라.
(b) 잔차 $r=y-\Phi\theta_{\text{ML}}$과 $\sigma^2_{\text{ML}}$을 구하라. $\Phi^\top r=0$임을 확인하고, 기하학적으로 무엇을 뜻하는지 쓰라.
(c) 사전분포 $\theta\sim\mathcal N(0,b^2I)$를 두면 $\theta_{\text{MAP}}=\big(\Phi^\top\Phi+\frac{\sigma^2}{b^2}I\big)^{-1}\Phi^\top y$임을 유도하라.
(d) $\sigma^2/b^2=2$일 때 $\theta_{\text{MAP}}$을 구하고 $\|\theta_{\text{MAP}}\|<\|\theta_{\text{ML}}\|$임을 확인하라.

### 2-A4. PCA (20점) [10장]

데이터 $(5,3),\ (-3,-1),\ (2,-1),\ (0,3)$을 주성분 하나($M=1$)로 줄인다.

(a) 평균 $\mu$를 빼고 공분산 $S$(분모 $N$)를 구하라.
(b) $S$의 고윳값과 단위 고유벡터를 구하라. 첫 주성분 $b_1$은?
(c) 좌표 $z_n=b_1^\top(x_n-\mu)$를 구하고 $z$의 분산이 $\lambda_1$임을 확인하라. 설명된 분산의 비율은?
(d) 복원 $\tilde x_n=\mu+b_1z_n$을 구하고 평균 제곱 재구성 오차가 $\lambda_2$임을 확인하라.
(e) "사영한 분산을 최대로 하는 단위벡터 $b_1$은 $S$의 가장 큰 고윳값의 고유벡터"임을 라그랑주 승수로 유도하라.

### 2-A5. GMM과 EM (15점) [11장]

1차원 데이터 $0,\ 2,\ 4$, $K=2$. 초기값 $\pi=(0.5,0.5)$, $\mu=(0,4)$, $\sigma_1^2=\sigma_2^2=1$. ($e^{-8}\approx3.4\times10^{-4}$이므로 0으로 근사해도 된다.)

(a) E 단계: 세 점의 책임도 $r_{n1},r_{n2}$를 구하라.
(b) M 단계: $N_k$, $\mu_k$, $\sigma_k^2$, $\pi_k$를 구하라.
(c) GMM 로그 가능도를 미분해 0으로 놓아도 닫힌 해가 바로 나오지 않는 이유를 쓰라. EM이 반복마다 보장하는 것은 무엇인가?
(d) 책임도를 0 또는 1로만 정하고 공분산을 무시(단위행렬로 고정)하면 어떤 알고리즘과 같아지는가?

### 2-A6. 하드 마진 SVM과 커널 (15점) [12장]

양성($y=+1$): $(2,0),\ (0,2),\ (3,3)$. 음성($y=-1$): $(0,0)$.

(a) 초평면 $w=(1,1)^\top$, $b=-1$이 모든 점에서 $y_n(w^\top x_n+b)\ge1$을 만족함을 확인하고, 마진(초평면에서 가장 가까운 점까지의 거리)을 구하라.
(b) 서포트 벡터는 어느 점인가? $w=\sum_n\alpha_ny_nx_n$과 $\sum_n\alpha_ny_n=0$을 이용해 쌍대 변수 $\alpha_n$을 구하고, 쌍대 목적값이 원 목적값 $\frac12\|w\|^2$과 같음을 확인하라.
(c) 같은 $(w,b)$에서 음성 점 $(1,0.5)$와 $(0.5,0.25)$의 힌지 손실 $\max\{0,1-yf(x)\}$을 구하라. 각 점은 마진 밖, 마진 안, 오분류 중 어디인가?
(d) 커널 $k(x,z)=(x^\top z)^2$에 해당하는 특징 맵 $\phi:\mathbb R^2\to\mathbb R^3$을 쓰고, $x=(1,2)$, $z=(3,1)$에서 $k(x,z)=\phi(x)^\top\phi(z)$를 확인하라.

---

## Part 1 B형: Basic Mathematics (60 min, 6 problems, English)

> 난이도가 오른 경우를 가정한 세트다. 영어 지문으로 출제되는 경우에 대비해 지문을 영어로 쓰고, 문제마다 아래에 우리말 요지를 붙였다.

### 1-B1. Vector spaces and linear maps (15 pts) [Ch. 2]

(a) Show that $U=\{x\in\mathbb R^3: x_1+2x_2-x_3=0\}$ is a subspace of $\mathbb R^3$. Find a basis of $U$ and $\dim U$.
(b) Let $\Phi:\mathbb R^3\to\mathbb R^2$, $\Phi(x)=(x_1+x_2,\ x_2-x_3)^\top$. Find $\ker\Phi$, $\operatorname{rk}\Phi$ and $\operatorname{Im}\Phi$. Then find the transformation matrix $\tilde A_\Phi$ of $\Phi$ with respect to the ordered bases $\tilde B=\big((1,1,0)^\top,(0,1,1)^\top,(1,0,1)^\top\big)$ of $\mathbb R^3$ and $\tilde C=\big((1,1)^\top,(1,-1)^\top\big)$ of $\mathbb R^2$.
(c) Prove that $\operatorname{rk}(A^\top A)=\operatorname{rk}(A)$ for every $A\in\mathbb R^{m\times n}$.

> 요지: (a) 부분공간 증명, 기저, 차원 (b) 핵, 랭크, 상, 기저 변환 행렬 (c) $\operatorname{rk}(A^\top A)=\operatorname{rk}(A)$ 증명

### 1-B2. Inner products, angles and rotations (15 pts) [Ch. 3]

Let $\langle x,y\rangle_A:=x^\top Ay$ with $A=\begin{bmatrix}2&-1\\-1&1\end{bmatrix}$.

(a) Show that $\langle\cdot,\cdot\rangle_A$ is an inner product on $\mathbb R^2$.
(b) Compute the angle between $e_1=(1,0)^\top$ and $e_2=(0,1)^\top$ with respect to $\langle\cdot,\cdot\rangle_A$.
(c) Compute the orthogonal projection of $x=(1,1)^\top$ onto $\operatorname{span}\{e_1\}$ with respect to $\langle\cdot,\cdot\rangle_A$, and find the orthogonal complement of $\operatorname{span}\{e_1\}$ under this inner product.
(d) Let $R(\theta)=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$. Show that $R(\theta)$ is orthogonal, $\det R(\theta)=1$, and $R(\theta)$ preserves the standard inner product (hence lengths and angles). Show $R(\alpha)R(\beta)=R(\alpha+\beta)$.

> 요지: 내적 판정, 그 내적에서의 각도·사영·직교여공간, 회전행렬 성질 증명

### 1-B3. Singular value decomposition (20 pts) [Ch. 4]

$A=\begin{bmatrix}3&2&2\\2&3&-2\end{bmatrix}$.

(a) Compute an SVD $A=U\Sigma V^\top$: all singular values, $U$, and $V$ (including a unit vector spanning $\ker A$).
(b) Find the best rank-1 approximation $\hat A(1)$ and compute $\|A-\hat A(1)\|_2$ and $\|A-\hat A(1)\|_F$.
(c) Show that the nonzero eigenvalues of $A^\top A$ are the squared singular values of $A$, and that $\|A\|_F^2=\sum_i\sigma_i^2$.

> 요지: SVD 손계산, 계수 1 근사(Eckart–Young), 프로베니우스 노름 = 특이값 제곱합

### 1-B4. Matrix calculus and backpropagation (15 pts) [Ch. 5]

(a) For $f(x)=x^\top Ax$ with $A\in\mathbb R^{n\times n}$ (not necessarily symmetric), show from the definition of partial derivatives that $\dfrac{df}{dx}=x^\top(A+A^\top)$.
(b) Let $L(W)=\|y-Wx\|^2$ with $W\in\mathbb R^{2\times3}$. Show that $\dfrac{dL}{dW}=-2(y-Wx)x^\top$ and evaluate it for $W=\begin{bmatrix}1&1&1\\0&1&0\end{bmatrix}$, $x=(1,0,2)^\top$, $y=(1,2)^\top$.
(c) Consider $z=W_1x$, $h=\mathrm{ReLU}(z)$ (elementwise), $\hat y=w_2^\top h$, $L=\frac12(\hat y-y)^2$ with $x=(1,2)^\top$, $W_1=\begin{bmatrix}1&-1\\0&1\end{bmatrix}$, $w_2=(3,1)^\top$, $y=1$.
 (i) Compute the forward pass $z,h,\hat y,L$.
 (ii) Compute $\partial L/\partial w_2$, $\partial L/\partial z$, $\partial L/\partial W_1$, $\partial L/\partial x$.
 (iii) Take one gradient step on $W_1$ only with step size $\gamma=0.1$ and compute the new loss.

> 요지: 이차형식 미분 증명, 행렬에 대한 미분, 작은 신경망 역전파 손계산

### 1-B5. Probability and distributions (15 pts) [Ch. 6]

(a) Let $X\sim\mathrm{Bin}(N,\mu)$. Writing $X$ as a sum of $N$ independent Bernoulli variables, prove $\mathbb E[X]=N\mu$ and $\mathbb V[X]=N\mu(1-\mu)$.
(b) A coin has unknown bias $\mu$ with prior $\mathrm{Beta}(1,3)$. You observe 7 heads in 10 tosses. Find the posterior, its mean, its mode ($\mu_{\text{MAP}}$), and compare them with $\mu_{\text{ML}}$.
(c) $x\sim\mathcal N(1,4)$ and $y\mid x\sim\mathcal N(2x-1,\,1)$. Find $p(y)$, $\operatorname{Cov}[x,y]$ and $p(x\mid y=5)$.
(d) $X\sim\mathcal U(0,1)$ and $Y=-\ln X$. Find the pdf of $Y$ using the change-of-variables technique.

> 요지: 이항분포 평균·분산 증명, 베타-이항 켤레, 가우시안 선형 모델의 주변·조건부, 변수 변환

### 1-B6. Optimization and convexity (20 pts) [Ch. 5, 7]

(a) $f(x,y)=x^4+y^2-2xy$. Find all stationary points and classify each using the Hessian. Is $f$ convex? What is the global minimum value?
(b) Solve $\min\ (x_1-2)^2+(x_2-1)^2$ subject to $x_1+x_2\le2$. Verify the KKT conditions, then derive the Lagrangian dual function $\mathfrak D(\lambda)$ and show that strong duality holds.
(c) Show that $\varphi(t)=-\log t$ is convex on $t>0$. Using Jensen's inequality, prove $\mathbb E[\log X]\le\log\mathbb E[X]$ for a positive random variable $X$, and check it for $X$ uniform on $\{1,4\}$.

> 요지: 정류점 분류, KKT와 쌍대, 볼록성과 젠센 부등식(볼록·오목 성질로 푸는 확률 문제)

---

## Part 2 B형: Basic AI (60 min, 6 problems, English)

### 2-B1. Parameter estimation and regularization (15 pts) [Ch. 8, 9]

(a) Let $x_1,\dots,x_N$ be i.i.d. from $p(x\mid\lambda)=\lambda e^{-\lambda x}$ ($x\ge0$). Derive $\lambda_{\text{ML}}$ and verify that it is a maximum. Compute it for the data $\{1,2,3,2\}$.
(b) Linear regression $y_n=\phi(x_n)^\top\theta+\epsilon$, $\epsilon\sim\mathcal N(0,\sigma^2)$, prior $\theta\sim\mathcal N(0,b^2I)$. Show that MAP estimation is equivalent to minimizing $\|y-\Phi\theta\|^2+\lambda\|\theta\|_2^2$ and identify $\lambda$.
(c) Which prior on $\theta$ makes MAP estimation equivalent to $L_1$-regularized regression (LASSO)? Write the negative log-posterior.

> 요지: 지수분포 MLE, 가우시안 사전분포의 MAP = 릿지, 라플라스 사전분포 = LASSO(교재 9.5절)

### 2-B2. Bayesian linear regression (20 pts) [Ch. 9]

$y=\theta_0+\theta_1x+\epsilon$, $\epsilon\sim\mathcal N(0,1)$, prior $\theta\sim\mathcal N(0,I)$. Data $(x,y)$: $(0,1),\ (1,2),\ (2,4)$.

(a) By completing the square in $\log p(\theta\mid\mathcal X,\mathcal Y)$, derive $S_N=(S_0^{-1}+\sigma^{-2}\Phi^\top\Phi)^{-1}$ and $m_N=S_N(S_0^{-1}m_0+\sigma^{-2}\Phi^\top y)$.
(b) Compute $S_N$ and $m_N$, and compare $m_N$ with $\theta_{\text{ML}}$.
(c) Compute the posterior predictive distribution $p(y_*\mid\mathcal X,\mathcal Y,x_*=3)$. Which part of its variance comes from parameter uncertainty?
(d) Write the marginal likelihood $p(\mathcal Y\mid\mathcal X)$ as a Gaussian and give its covariance matrix numerically. What is it used for?

> 요지: 베이즈 선형회귀 사후분포 유도·계산, 예측분포, 주변 가능도

### 2-B3. PCA: projection view and computation (15 pts) [Ch. 10]

(a) For centered data with covariance $S$, let $b_1,\dots,b_D$ be an orthonormal basis and project onto $\operatorname{span}\{b_1,\dots,b_M\}$. Show that the average squared reconstruction error is $J_M=\sum_{j=M+1}^{D}b_j^\top Sb_j$, and conclude that its minimum is $\sum_{j=M+1}^{D}\lambda_j$.
(b) $D=3$, $N=2$, centered data matrix $X=\begin{bmatrix}1&-1\\2&-2\\2&-2\end{bmatrix}$ (columns are data points). Use the $N<D$ trick: find the top eigenvector of $\frac1NX^\top X$ and recover the principal direction $u_1$ of $S=\frac1NXX^\top$ and $\lambda_1$.
(c) Relate $\lambda_1$ to the largest singular value of $X$.
(d) In probabilistic PCA, $p(x)=\mathcal N(x\mid\mu,\,BB^\top+\sigma^2I)$. For $B=(1,2,2)^\top$ and $\sigma^2=0.5$, find the eigenvalues and the top eigenvector of the covariance, and relate them to (b).

> 요지: 재구성 오차 = 버린 고윳값의 합 증명, $N<D$ 트릭, SVD와의 관계, PPCA 공분산

### 2-B4. EM for Gaussian mixtures: derivations (15 pts) [Ch. 11]

(a) For $\mathcal L=\sum_n\log\sum_k\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)$, show that $\partial\mathcal L/\partial\mu_k=0$ gives $\mu_k=\frac1{N_k}\sum_nr_{nk}x_n$, where $r_{nk}$ is the responsibility and $N_k=\sum_nr_{nk}$.
(b) Derive $\pi_k=N_k/N$ using a Lagrange multiplier for $\sum_k\pi_k=1$.
(c) 1D, $K=2$, $\pi=(0.4,0.6)$, $\mu=(0,3)$, $\sigma^2=(1,4)$. Given $\mathcal N(1\mid0,1)\approx0.2420$ and $\mathcal N(1\mid3,4)\approx0.1210$, compute the responsibilities of $x=1$.
(d) Explain why maximum likelihood for a GMM can degenerate (likelihood $\to\infty$).

> 요지: $\mu_k$·$\pi_k$ 갱신식 유도, 책임도 계산, 최대가능도의 특이점(교재 11.5절)

### 2-B5. Soft-margin SVM (20 pts) [Ch. 12]

(a) Starting from the soft-margin primal (12.26a) $\min_{w,b,\xi}\frac12\|w\|^2+C\sum_n\xi_n$ s.t. $y_n(w^\top x_n+b)\ge1-\xi_n$, $\xi_n\ge0$, derive the dual problem and show the box constraint $0\le\alpha_n\le C$.
(b) Show that the primal is equivalent to $\min_{w,b}\frac12\|w\|^2+C\sum_n\max\{0,1-y_n(w^\top x_n+b)\}$.
(c) Using complementary slackness, describe where a point lies when $\alpha_n=0$, $0<\alpha_n<C$, and $\alpha_n=C$.
(d) Let $w=(1,-1)^\top$, $b=0$, $C=1$ and the data $(2,0)$ $(+1)$, $(0.5,0)$ $(+1)$, $(0,1)$ $(-1)$, $(1,0)$ $(-1)$. Compute $y_nf(x_n)$, the hinge losses, and the objective. If this $(w,b)$ were optimal, what values could each $\alpha_n$ take? Use $w=\sum_n\alpha_ny_nx_n$ and $\sum_n\alpha_ny_n=0$ to decide whether it is actually optimal.

> 요지: 소프트 마진 쌍대 유도, 힌지 손실과의 동치, 상보 여유성, 숫자로 최적성 판정

### 2-B6. Short essays (15 pts, answer 3 of 5) [Ch. 8–12]

(1) Explain why the maximum-likelihood prediction $\Phi\theta_{\text{ML}}$ in linear regression is the orthogonal projection of $y$ onto the column space of $\Phi$.
(2) Explain the relation among PCA, the SVD of the data matrix, and the Eckart–Young theorem.
(3) Compare a GMM fitted by EM with $K$-means.
(4) Why is the SVM dual useful? What must a valid kernel satisfy? Check that the Gram matrix of $k(x,z)=(x^\top z)^2$ on $x_1=(1,0)$, $x_2=(0,1)$, $x_3=(1,1)$ is positive semidefinite.
(5) Explain nested cross-validation and why the cross-validation score of the selected model is optimistic.

> 요지: 서술형 5개 중 3개. 사영과 회귀, PCA·SVD·Eckart–Young, GMM과 K-평균, 쌍대와 커널, 중첩 교차검증

---

## 영어 지문 용어 대조표

| 영어 | 뜻 | 영어 | 뜻 |
|---|---|---|---|
| Show that / Prove | 증명하라 | Derive | 식을 끝까지 유도하라 |
| Compute / Evaluate | 값을 계산하라 | Verify / Check | 확인하라 |
| Justify | 이유를 대라 | Classify | 종류를 판정하라(극소·극대·안장점 등) |
| subspace | 부분공간 | basis / dimension | 기저 / 차원 |
| rank, kernel(null space), image | 랭크, 핵(영공간), 상 | transformation matrix | 변환 행렬 |
| ordered basis | 순서 기저 | orthogonal complement | 직교여공간 |
| orthogonal projection | 정사영 | inner product | 내적 |
| eigenvalue / eigenvector | 고윳값 / 고유벡터 | singular value | 특이값 |
| positive (semi)definite | 양의 (준)정부호 | rank-1 approximation | 계수 1 근사 |
| gradient / Jacobian / Hessian | 기울기 / 야코비안 / 헤시안 | stationary point / saddle point | 정류점 / 안장점 |
| step size (learning rate) | 학습률 | convex / concave | 볼록 / 오목 |
| Lagrangian / dual function | 라그랑지안 / 쌍대 함수 | strong duality | 강한 쌍대성 |
| complementary slackness | 상보 여유성 | i.i.d. | 독립이고 같은 분포 |
| likelihood / prior / posterior | 가능도 / 사전분포 / 사후분포 | conjugate prior | 켤레 사전분포 |
| marginal likelihood (evidence) | 주변 가능도 | posterior predictive | 사후 예측 분포 |
| change of variables | 변수 변환 | empirical risk | 경험적 위험 |
| overfitting / regularization | 과적합 / 정규화 | cross-validation (nested) | (중첩) 교차검증 |
| d-separation / collider | d-분리 / 충돌 노드(화살표가 모이는 노드) | latent variable | 잠재변수 |
| responsibility | 책임도 | mixture weight | 혼합 비율 |
| reconstruction error | 재구성 오차 | explained variance | 설명된 분산 |
| margin / support vector | 마진 / 서포트 벡터 | slack variable | 여유 변수 $\xi$ |
| hinge loss | 힌지 손실 | Gram matrix | 그람 행렬 |
