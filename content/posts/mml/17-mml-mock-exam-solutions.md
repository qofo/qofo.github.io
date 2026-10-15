---
title: "MML 실전 모의고사 풀이: 답과 단계별 풀이"
slug: "mml-mock-exam-solutions"
date: 2026-10-15
weight: 17
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "머신러닝 수학", "모의고사", "선형대수", "확률", "최적화", "선형회귀", "PCA", "GMM", "SVM"]
description: "MML 실전 모의고사 네 세트(기초수학·기초 AI의 A형과 B형) 24문항의 답과 단계별 풀이. 문제마다 답안지에 꼭 보여야 할 줄(채점 포인트)과 교재 근거를 적었다."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재:** Deisenroth·Faisal·Ong, *Mathematics for Machine Learning* ([mml-book.github.io](https://mml-book.github.io/)에 공개된 PDF, 2024-01-15 판). 절과 식 번호는 그 PDF 기준이다.  
> **문제지:** [앞 편](16-mml-mock-exams.md)에 문제만 모아 두었다. 먼저 60분 타이머로 풀어 본 뒤 이 글로 맞춰 본다.  
> **검산:** 숫자 답은 모두 sympy(정확한 분수)와 numpy·scipy(수치 미분, 이차계획 풀이)로 다시 계산했다. 교재 절·식·정리 번호는 PDF 원문과 대조했다.  
> **읽는 법:** 문제마다 **풀이 → 답 → 채점 포인트(답안지에 꼭 보여야 할 줄) → 교재 근거** 순서다. 교재에 없는 내용은 **교재 밖 보충**으로 표시했다.

| 세트 | 바로 가기 |
|---|---|
| Part 1 A형 | [1-A1](#1-a1) · [1-A2](#1-a2) · [1-A3](#1-a3) · [1-A4](#1-a4) · [1-A5](#1-a5) · [1-A6](#1-a6) |
| Part 2 A형 | [2-A1](#2-a1) · [2-A2](#2-a2) · [2-A3](#2-a3) · [2-A4](#2-a4) · [2-A5](#2-a5) · [2-A6](#2-a6) |
| Part 1 B형 | [1-B1](#1-b1) · [1-B2](#1-b2) · [1-B3](#1-b3) · [1-B4](#1-b4) · [1-B5](#1-b5) · [1-B6](#1-b6) |
| Part 2 B형 | [2-B1](#2-b1) · [2-B2](#2-b2) · [2-B3](#2-b3) · [2-B4](#2-b4) · [2-B5](#2-b5) · [2-B6](#2-b6) |

---

## Part 1 A형

### 1-A1

**(a)** 행 연산: $R_2\leftarrow R_2-2R_1$, $R_3\leftarrow R_3-3R_1$, $R_3\leftarrow R_3-R_2$.

$$
\begin{aligned}
&\left[\begin{array}{cccc|c}1&2&0&1&1\\2&4&1&4&3\\3&6&1&5&4\end{array}\right]\\
\to\ &\left[\begin{array}{cccc|c}1&2&0&1&1\\0&0&1&2&1\\0&0&1&2&1\end{array}\right]\\
\to\ &\left[\begin{array}{cccc|c}1&2&0&1&1\\0&0&1&2&1\\0&0&0&0&0\end{array}\right]
\end{aligned}
$$

이미 RREF다(피벗 1열·3열, 피벗 위아래가 0). 피벗이 2개라 $\operatorname{rank}(A)=2$.

**(b)** 자유변수 $x_2=s$, $x_4=t$. 첫 줄 $x_1=1-2s-t$, 둘째 줄 $x_3=1-2t$.

$$
x=\begin{bmatrix}1\\0\\1\\0\end{bmatrix}+s\begin{bmatrix}-2\\1\\0\\0\end{bmatrix}+t\begin{bmatrix}-1\\0\\-2\\1\end{bmatrix}
$$

($s,t$는 임의의 실수.) 검산: $A(1,0,1,0)^\top=(1,3,4)^\top=b$, 두 방향 벡터에 $A$를 곱하면 0.

**(c)** 기저 $\{(-2,1,0,0)^\top,(-1,0,-2,1)^\top\}$, $\dim\ker A=2$. $\operatorname{rank}+\dim\ker=2+2=4=$ 열의 수 $n$.

**(d)** 해가 없다. 셋째 행이 첫째 행과 둘째 행의 합이므로 해가 있으려면 $b_3=b_1+b_2$여야 한다. $5\ne1+3$이라 소거하면 $0=1$이 남는다.

**채점 포인트:** 피벗 열 표시, 자유변수 매개변수화, 영공간 벡터 검산, $0=1$ 모순.
**교재 근거:** 2.3절(특수해와 일반해, RREF), 정리 2.24(차원 정리).

### 1-A2

**(a)** $B^\top B=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, $(B^\top B)^{-1}=\frac13\begin{bmatrix}2&-1\\-1&2\end{bmatrix}$.

$$
\begin{aligned}
P&=B(B^\top B)^{-1}B^\top\\
&=\frac13\begin{bmatrix}2&1&1\\1&2&-1\\1&-1&2\end{bmatrix}
\end{aligned}
$$

좌표: $B^\top x=(3,3)^\top$, $\lambda=(B^\top B)^{-1}B^\top x=\frac13(6-3,\,-3+6)=(1,1)$. 따라서 $\pi_U(x)=b_1+b_2=(2,1,1)^\top$ ($Px$로 계산해도 같다).

**(b)** $x-\pi_U(x)=(-2,2,2)^\top$. 이 벡터는 $b_1$, $b_2$와 내적이 0이다(직교 확인). 거리 $=\sqrt{4+4+4}=2\sqrt3$.

**(c)** $u_1=b_1$. $u_2=b_2-\frac{b_2^\top u_1}{u_1^\top u_1}u_1=(1,0,1)-\frac12(1,1,0)=(\frac12,-\frac12,1)$.

$$
\begin{aligned}
e_1&=\tfrac1{\sqrt2}(1,1,0)^\top\\
e_2&=\tfrac1{\sqrt6}(1,-1,2)^\top
\end{aligned}
$$

$e_1^\top x=\frac3{\sqrt2}$, $e_2^\top x=\frac{0-3+6}{\sqrt6}=\frac3{\sqrt6}$이므로 $\pi_U(x)=\frac32(1,1,0)+\frac12(1,-1,2)=(2,1,1)$. (a)와 같다.

**(d)** $P^2=B(B^\top B)^{-1}\underbrace{B^\top B(B^\top B)^{-1}}_{I}B^\top=P$. $B^\top B$가 대칭이라 그 역행렬도 대칭이므로 $P^\top=B\big((B^\top B)^{-1}\big)^\top B^\top=P$.
$Pv=\lambda v$이면 $\lambda v=Pv=P^2v=\lambda^2v$라서 $\lambda\in\{0,1\}$. 여기서는 $U$ 안의 방향 두 개가 고윳값 1, $U$에 수직인 $(1,-1,-1)$ 방향이 고윳값 0이다.

**채점 포인트:** 정규방정식 $B^\top(x-B\lambda)=0$에서 출발, 잔차의 직교 확인, 그람-슈미트에서 $u_2$를 정규화.
**교재 근거:** 3.8.2절 식 (3.55)~(3.59), 그람-슈미트 (3.67)~(3.68), 정규직교기저일 때 (3.65).

### 1-A3

**(a)** $\det(A-\lambda I)=(4-\lambda)(3-\lambda)-2=\lambda^2-7\lambda+10=(\lambda-5)(\lambda-2)$.
- $\lambda=5$: $A-5I=\begin{bmatrix}-1&1\\2&-2\end{bmatrix}$ → $v_1=(1,1)^\top$
- $\lambda=2$: $A-2I=\begin{bmatrix}2&1\\2&1\end{bmatrix}$ → $v_2=(1,-2)^\top$

**(b)** $P=\begin{bmatrix}1&1\\1&-2\end{bmatrix}$, $D=\operatorname{diag}(5,2)$, $P^{-1}=\frac13\begin{bmatrix}2&1\\1&-1\end{bmatrix}$.

$$
\begin{aligned}
A^n&=PD^nP^{-1}\\
&=\frac13\begin{bmatrix}2\cdot5^n+2^n & 5^n-2^n\\ 2\cdot5^n-2^{n+1} & 5^n+2^{n+1}\end{bmatrix}
\end{aligned}
$$

$n=1$: $\frac13\begin{bmatrix}12&3\\6&9\end{bmatrix}=A$. ($n=3$이면 $\begin{bmatrix}86&39\\78&47\end{bmatrix}$로 $A^3$을 직접 곱한 값과 같다.)

**(c)** $v_1^\top v_2=1-2=-1\ne0$이라 직교하지 않는다. 스펙트럼 정리는 **대칭행렬**에만 고유벡터로 된 정규직교기저를 보장한다. $A$는 $a_{12}=1\ne a_{21}=2$라 대칭이 아니므로 보장이 없다. 고윳값이 서로 달라 고유벡터가 선형독립이므로 대각화는 된다.

**(d)** $L=\begin{bmatrix}l_{11}&0\\l_{21}&l_{22}\end{bmatrix}$: $l_{11}^2=4\Rightarrow l_{11}=2$, $l_{21}l_{11}=2\Rightarrow l_{21}=1$, $l_{21}^2+l_{22}^2=5\Rightarrow l_{22}=2$.

$$
L=\begin{bmatrix}2&0\\1&2\end{bmatrix},\qquad LL^\top=\begin{bmatrix}4&2\\2&5\end{bmatrix}=C
$$

**채점 포인트:** 특성다항식, 고유벡터 계산, $P^{-1}$, 대칭 여부와 스펙트럼 정리의 조건.
**교재 근거:** 4.2절, 4.4절(고윳값 분해), 정리 4.15(스펙트럼 정리), 정리 4.18(촐레스키 분해).

### 1-A4

**(a)** 편미분:

$$
\begin{aligned}
\frac{\partial f}{\partial x_1}&=2x_1x_2+x_2e^{x_1x_2}\\
\frac{\partial f}{\partial x_2}&=x_1^2+x_1e^{x_1x_2}
\end{aligned}
$$

$(1,0)$에서 $\nabla f=[\,0,\ 2\,]$ ($1\times2$ 행벡터).

**(b)** 2계 편미분:

$$
\begin{aligned}
f_{11}&=2x_2+x_2^2e^{x_1x_2}\\
f_{12}&=2x_1+e^{x_1x_2}+x_1x_2e^{x_1x_2}\\
f_{22}&=x_1^2e^{x_1x_2}
\end{aligned}
$$

$(1,0)$에서 $H=\begin{bmatrix}0&3\\3&1\end{bmatrix}$.

**(c)** $f(1,0)=0+e^0=1$.

$$
\begin{aligned}
T_2(\delta)&=1+[\,0,\ 2\,]\delta+\tfrac12\delta^\top H\delta\\
&=1+2\delta_2+3\delta_1\delta_2+\tfrac12\delta_2^2
\end{aligned}
$$

**(d)** $g(x)=(Ax-b)^\top(Ax-b)$를 연쇄법칙으로 미분하면 $\dfrac{dg}{dx}=2(Ax-b)^\top A$ ($1\times2$).
$Ax_0-b=(1,0,1)-(1,1,1)=(0,-1,0)$이므로 $\dfrac{dg}{dx}\Big|_{x_0}=2\,(0,-1,0)A=2\,(0,-1)=(0,-2)$.
최소점은 기울기를 0으로 두는 정규방정식 $A^\top Ax=A^\top b$: $A^\top A=\begin{bmatrix}2&2\\2&5\end{bmatrix}$, $A^\top b=(2,3)^\top$, $x=\frac16\begin{bmatrix}5&-2\\-2&2\end{bmatrix}\begin{bmatrix}2\\3\end{bmatrix}=\left(\frac23,\frac13\right)$.

**채점 포인트:** 기울기를 행벡터로 쓰기, 혼합 편미분 $f_{12}$의 곱의 미분, 테일러의 $\frac12$, $A^\top$의 위치.
**교재 근거:** 5.2절(편미분, 기울기, 연쇄법칙), 5.3절(야코비안), 5.7~5.8절(헤시안, 다변수 테일러), 5.5절 행렬 미분 항등식.

### 1-A5

**(a)** 전체 확률의 법칙: $P(D)=0.5(0.01)+0.3(0.02)+0.2(0.05)=0.005+0.006+0.010=0.021$.
베이즈 정리: $P(C\mid D)=\dfrac{0.010}{0.021}=\dfrac{10}{21}\approx0.476$. 생산 비율은 20%뿐인데 불량률이 높아 불량품의 거의 절반이 C에서 나온다.

**(b)** $\mu=\mathbb E[x]$는 상수다.

$$
\begin{aligned}
\mathbb E[(x-\mu)^2]&=\mathbb E[x^2-2\mu x+\mu^2]\\
&=\mathbb E[x^2]-2\mu\,\mathbb E[x]+\mu^2\\
&=\mathbb E[x^2]-\mu^2
\end{aligned}
$$

기댓값의 선형성만 썼다.

**(c)** (i) 가우시안의 주변분포는 해당 성분만 고른다: $p(x_1)=\mathcal N(1,2)$.
(ii) 조건부 평균과 분산: 

$$
\begin{aligned}
\mu_{1\mid2}&=\mu_1+\frac{\Sigma_{12}}{\Sigma_{22}}(4-\mu_2)\\
&=1+\tfrac12\cdot2=2\\
\sigma^2_{1\mid2}&=\Sigma_{11}-\frac{\Sigma_{12}^2}{\Sigma_{22}}\\
&=2-\tfrac12=\tfrac32
\end{aligned}
$$

$p(x_1\mid x_2=4)=\mathcal N(2,\tfrac32)$. $x_2$가 평균보다 크게 나왔고 상관이 양수라 $x_1$의 기대값도 올라가고, 정보를 얻어 분산은 줄었다.
(iii) $a=(1,-1)^\top$: 평균 $a^\top\mu=-1$, 분산 $a^\top\Sigma a=2+2-2\cdot1=2$. $y\sim\mathcal N(-1,2)$.
(iv) $\mathbb E[x_1x_2]=\operatorname{Cov}[x_1,x_2]+\mu_1\mu_2=1+2=3$.

**채점 포인트:** 전체 확률의 분모, 조건부 공식 두 줄, 선형변환의 $a^\top\Sigma a$.
**교재 근거:** 6.3절(베이즈 정리), 식 (6.44)(분산의 raw-score 공식), 6.5.1절 식 (6.65)~(6.67), 식 (6.88)(선형변환).

### 1-A6

**(a)(i)** $\nabla f=(Qx-b)^\top=0\Rightarrow x^*=Q^{-1}b=(1,\tfrac12)^\top$.

**(ii)** $x_{k+1}=x_k-\gamma(Qx_k-b)$.
- $x_1=0-0.2(0-b)=(0.2,\,0.4)$
- $Qx_1-b=(0.2,1.6)-(1,2)=(-0.8,-0.4)$, $x_2=(0.2,0.4)+0.2(0.8,0.4)=(0.36,\,0.48)$

**(iii)** $b=Qx^*$이므로 $x_{k+1}-x^*=(x_k-x^*)-\gamma Q(x_k-x^*)=(I-\gamma Q)e_k$.
$I-\gamma Q=\operatorname{diag}(1-\gamma,\,1-4\gamma)$라 성분마다 따로 줄어든다. 어떤 시작점에서도 수렴하려면 $|1-\gamma|<1$이고 $|1-4\gamma|<1$, 즉 $0<\gamma<0.5$.
가장 빠른 $\gamma$는 두 배율 중 큰 값 $\max\{|1-\gamma|,|1-4\gamma|\}$을 최소로 하는 값이다. $1-\gamma=4\gamma-1$에서 $\gamma=0.4$, 이때 오차는 한 번에 0.6배가 된다.
(검산: $e_0=(-1,-0.5)$, $e_1=(0.8\cdot(-1),\ 0.2\cdot(-0.5))=(-0.8,-0.1)$ → $x_1=x^*+e_1=(0.2,0.4)$. 맞다.)
일반형 $0<\gamma<2/\lambda_{\max}$, 최적 $\gamma=2/(\lambda_{\min}+\lambda_{\max})$은 **교재 밖 보충**이다. 교재 7.1절은 학습률이 너무 크면 발산하고 너무 작으면 느리다는 것과 조건수가 나쁘면 지그재그로 느려진다는 것을 설명한다.

**(b)(i)** $g(x)=2-x_1-x_2\le0$. $\mathfrak L(x,\lambda)=x_1^2+x_2^2+\lambda(2-x_1-x_2)$, $\lambda\ge0$.
**(ii)** $\partial\mathfrak L/\partial x_i=2x_i-\lambda=0\Rightarrow x_1=x_2=\lambda/2$. 대입:

$$
\begin{aligned}
\mathfrak D(\lambda)&=\frac{\lambda^2}4+\frac{\lambda^2}4+\lambda(2-\lambda)\\
&=2\lambda-\frac{\lambda^2}2
\end{aligned}
$$

**(iii)** $\mathfrak D'(\lambda)=2-\lambda=0\Rightarrow\lambda^*=2\ (\ge0)$, $\mathfrak D(\lambda^*)=2$. 원 문제: $x^*=(\lambda^*/2,\lambda^*/2)=(1,1)$은 제약을 만족하고 $f(x^*)=2$. 두 값이 같다(강한 쌍대성). 약한 쌍대성은 모든 $\lambda\ge0$과 가능한 $x$에 대해 $\mathfrak D(\lambda)\le f(x)$라는 뜻이다.

**채점 포인트:** 갱신식 두 번 정확히, 오차 반복식 유도, 부등식 방향을 $g\le0$으로 맞추기, $\mathfrak D$는 $x$에 대한 최소.
**교재 근거:** 7.1절 식 (7.6), 7.2절 식 (7.17)~(7.27)(라그랑주 쌍대, 최소최대 부등식).

---

## Part 2 A형

### 2-A1

**(a)** 음의 로그 가능도:

$$
\begin{aligned}
\mathcal L(\mu)&=-\sum_{n=1}^N\log\mathcal N(x_n\mid\mu,\sigma^2)\\
&=\frac1{2\sigma^2}\sum_n(x_n-\mu)^2\\
&\quad+\frac N2\log(2\pi\sigma^2)
\end{aligned}
$$

$\dfrac{d\mathcal L}{d\mu}=-\dfrac1{\sigma^2}\sum_n(x_n-\mu)=0\Rightarrow\mu_{\text{ML}}=\bar x=\dfrac{16}4=4$. (2계 도함수 $N/\sigma^2>0$라 최소.)

**(b)** $\sigma^2_{\text{ML}}=\frac1N\sum_n(x_n-\mu_{\text{ML}})^2=\frac{4+0+1+9}4=\frac72=3.5$.

**(c)** 로그 사후분포 $=-\frac1{2\cdot4}\sum_n(x_n-\mu)^2-\frac12\mu^2+\text{const}$. $\mu$에 대한 이차식이라 사후분포는 가우시안이다.
- 정밀도(분산의 역수): $\dfrac N{\sigma^2}+\dfrac1{\tau^2}=\dfrac44+1=2$ → 사후 분산 $\frac12$
- 평균: $\dfrac{\sum_nx_n/\sigma^2}{2}=\dfrac{16/4}2=2$

$p(\mu\mid\mathcal X)=\mathcal N(2,\tfrac12)$, 가우시안은 최빈값이 평균이므로 $\mu_{\text{MAP}}=2$. 사전분포가 0 쪽으로 끌어당겨 $\mu_{\text{ML}}=4$보다 작다.

**(d)** $\mu_{\text{MAP}}=\dfrac{N\bar x/\sigma^2}{N/\sigma^2+1/\tau^2}$. $N$이 커지면 데이터 정밀도 $N/\sigma^2$가 고정된 사전 정밀도 $1/\tau^2$를 압도해 $\mu_{\text{MAP}}\to\bar x=\mu_{\text{ML}}$, 사후 분산은 0으로 간다.

**채점 포인트:** 음의 로그 가능도의 두 항, 분모 $N$, 제곱 완성 또는 미분으로 사후 평균.
**교재 근거:** 8.3.1절(MLE, 예제 8.5 가우시안 가능도), 8.3.2절 식 (8.19)(MAP), 6.5.2절(가우시안의 곱).

### 2-A2

**(a)** $p(a,b,c,d)=p(a)\,p(b)\,p(c\mid a,b)\,p(d\mid c)$.
(i) **성립.** $a$와 $b$를 잇는 경로는 $a\to c\leftarrow b$ 하나다. $c$에서 화살표가 머리끼리 만나고(충돌 노드), $c$도 그 자손 $d$도 관측되지 않았으므로 막힌다.
(ii) **성립하지 않는다.** 충돌 노드 $c$의 자손 $d$가 관측되면 경로가 열린다(설명해 버리기 효과: 결과를 알면 두 원인이 서로 정보를 준다).
(iii) **성립.** $a\to c\to d$에서 $c$는 머리-꼬리 노드이고 관측되었으므로 막힌다. $a$에서 $d$로 가는 다른 경로는 없다.

**(b)** $R_{\text{emp}}(f,X,y)=\dfrac1N\sum_{n=1}^N\ell(y_n,\hat y_n)$, $\hat y_n=f(x_n,\theta)$. 유연한 모델은 훈련 데이터의 잡음까지 맞춰 훈련 위험은 작지만 처음 보는 데이터의 위험은 커진다(과적합). 경험적 위험은 훈련에 쓴 데이터로 잰 값이라 기대 위험을 낙관적으로 추정한다. 정규화는 $\lambda\|\theta\|^2$ 같은 벌점 항을 더해 매개변수가 커지는 것을 막는다.

**(c)** 
| 모델 | AIC $=\log p-M$ | BIC $=\log p-\frac12M\ln50$ |
|---|---|---|
| 1 ($M=3$) | $-83$ | $-80-1.5(3.912)=-85.87$ |
| 2 ($M=6$) | $-81$ | $-75-3(3.912)=-86.74$ |

두 식 모두 클수록 좋다. AIC는 **모델 2**, BIC는 **모델 1**을 고른다. BIC는 매개변수 하나당 $\frac12\ln N=1.956$을 깎아 AIC(1)보다 복잡도 벌점이 크다($N\ge8$이면 항상 그렇다).

**채점 포인트:** 충돌 노드 규칙(자손 관측 포함), 경험적 위험 식, AIC·BIC 부호 방향.
**교재 근거:** 8.5.1절 식 (8.31), 8.5.2절(d-분리), 8.2.2절 식 (8.6), 8.2.3절 식 (8.12), 8.6.4절 식 (8.48)·(8.49).

### 2-A3

**(a)** 행렬을 만든다.

$$
\begin{aligned}
\Phi&=\begin{bmatrix}1&0\\1&1\\1&2\\1&3\end{bmatrix}\\
\Phi^\top\Phi&=\begin{bmatrix}4&6\\6&14\end{bmatrix},\quad \Phi^\top y=\begin{bmatrix}12\\23\end{bmatrix}
\end{aligned}
$$

$\det=56-36=20$, $(\Phi^\top\Phi)^{-1}=\frac1{20}\begin{bmatrix}14&-6\\-6&4\end{bmatrix}$.
$\theta_{\text{ML}}=\frac1{20}(14\cdot12-6\cdot23,\ -6\cdot12+4\cdot23)=\frac1{20}(30,20)=(1.5,\ 1)$. 직선 $y=1.5+x$.

**(b)** $\Phi\theta_{\text{ML}}=(1.5,2.5,3.5,4.5)$, $r=(-0.5,\,0.5,\,0.5,\,-0.5)$, $\sigma^2_{\text{ML}}=\frac1N\|r\|^2=\frac14$.
$\Phi^\top r=\big(\sum r_n,\ \sum x_nr_n\big)=(0,\ 0+0.5+1-1.5)=(0,0)$. 잔차가 $\Phi$의 모든 열과 직교한다. 즉 $\Phi\theta_{\text{ML}}$은 $y$를 $\Phi$의 열공간에 정사영한 점이다(정규방정식 $\Phi^\top(y-\Phi\theta)=0$과 같은 말).

**(c)** 음의 로그 사후분포:

$$
\begin{aligned}
&-\log p(\theta\mid\mathcal X,\mathcal Y)\\
&=\frac1{2\sigma^2}\|y-\Phi\theta\|^2+\frac1{2b^2}\|\theta\|^2+\text{const}
\end{aligned}
$$

$\theta$로 미분해 0으로 두면 $-\frac1{\sigma^2}(y-\Phi\theta)^\top\Phi+\frac1{b^2}\theta^\top=0$, 정리하면 $\big(\Phi^\top\Phi+\frac{\sigma^2}{b^2}I\big)\theta=\Phi^\top y$.

**(d)** $\Phi^\top\Phi+2I=\begin{bmatrix}6&6\\6&16\end{bmatrix}$, $\det=60$, 역행렬 $\frac1{60}\begin{bmatrix}16&-6\\-6&6\end{bmatrix}$.
$\theta_{\text{MAP}}=\frac1{60}(16\cdot12-6\cdot23,\ -6\cdot12+6\cdot23)=\frac1{60}(54,66)=(0.9,\ 1.1)$.
$\|\theta_{\text{MAP}}\|^2=0.81+1.21=2.02<3.25=\|\theta_{\text{ML}}\|^2$. 교재 식은 절편 $\theta_0$도 함께 줄인다.

**채점 포인트:** $\Phi^\top\Phi$ 역행렬, 잔차 직교의 의미, 음의 로그 사후분포 두 항, $\lambda=\sigma^2/b^2$.
**교재 근거:** 9.2.1절 식 (9.12c), 식 (9.22), 9.2.3절 식 (9.31), 9.2.4절 식 (9.32), 9.4절(최대가능도 = 정사영).

### 2-A4

**(a)** $\mu=\big(\frac{5-3+2+0}4,\ \frac{3-1-1+3}4\big)=(1,1)$. 중심화: $(4,2),\ (-4,-2),\ (1,-2),\ (-1,2)$.
$(4,2)$와 $(-4,-2)$의 외적 합 $=2\begin{bmatrix}16&8\\8&4\end{bmatrix}$, $(1,-2)$와 $(-1,2)$의 외적 합 $=2\begin{bmatrix}1&-2\\-2&4\end{bmatrix}$.

$$
S=\frac14\begin{bmatrix}34&12\\12&16\end{bmatrix}=\begin{bmatrix}8.5&3\\3&4\end{bmatrix}
$$

**(b)** $\lambda^2-12.5\lambda+25=0$ → $\lambda=\frac{12.5\pm7.5}2=10,\ 2.5$.
$\lambda_1=10$: $S-10I=\begin{bmatrix}-1.5&3\\3&-6\end{bmatrix}$ → $b_1=\frac1{\sqrt5}(2,1)^\top$. $\lambda_2=2.5$: $b_2=\frac1{\sqrt5}(1,-2)^\top$.

**(c)** $z=b_1^\top(x-\mu)$: $(4,2)\to\frac{10}{\sqrt5}=2\sqrt5$, $(-4,-2)\to-2\sqrt5$, $(1,-2)\to0$, $(-1,2)\to0$.
평균 0, 분산 $\frac{20+20+0+0}4=10=\lambda_1$. 설명된 분산 비율 $\frac{10}{12.5}=80\%$.

**(d)** 처음 두 점은 $z_nb_1=\pm(4,2)$라 정확히 복원된다: $\tilde x=(5,3),(-3,-1)$. 나머지 두 점은 $z=0$이라 $\tilde x=\mu=(1,1)$.
오차 제곱: $0,\ 0,\ \|(1,-2)\|^2=5,\ \|(-1,2)\|^2=5$. 평균 $\frac{10}4=2.5=\lambda_2$.

**(e)** $\max_b\ b^\top Sb$ s.t. $b^\top b=1$. $\mathfrak L=b^\top Sb+\lambda(1-b^\top b)$.
$\dfrac{\partial\mathfrak L}{\partial b}=2b^\top S-2\lambda b^\top=0\Rightarrow Sb=\lambda b$ ($S$ 대칭). 이때 사영 분산 $=b^\top Sb=\lambda b^\top b=\lambda$이므로 가장 큰 고윳값을 고른다.

**채점 포인트:** 평균을 먼저 빼기, 분모 $N$, 단위 고유벡터, 재구성 오차 = 버린 고윳값.
**교재 근거:** 10.2절 식 (10.10)~(10.13), 10.3절 식 (10.44).

### 2-A5

**(a)** $\pi$와 분산이 같으므로 $r_{n1}=\dfrac{\mathcal N(x\mid0,1)}{\mathcal N(x\mid0,1)+\mathcal N(x\mid4,1)}$. 비 $\dfrac{\mathcal N(x\mid4,1)}{\mathcal N(x\mid0,1)}=\exp\!\big(\frac{x^2-(x-4)^2}2\big)=e^{4x-8}$이므로 $r_{n1}=\dfrac1{1+e^{4x-8}}$.

| $x_n$ | $r_{n1}$ | $r_{n2}$ |
|---|---|---|
| 0 | $1/(1+e^{-8})\approx0.9997\approx1$ | $\approx0$ |
| 2 | $1/2$ | $1/2$ |
| 4 | $\approx0$ | $\approx1$ |

**(b)** $N_1=1+0.5+0=1.5$, $N_2=1.5$.
- $\mu_1=\frac{1(0)+0.5(2)+0(4)}{1.5}=\frac23$, $\mu_2=\frac{0+0.5(2)+1(4)}{1.5}=\frac{10}3$
- $\sigma_1^2=\frac{1(0-\frac23)^2+0.5(2-\frac23)^2}{1.5}=\frac{4/9+8/9}{1.5}=\frac89$, 대칭이라 $\sigma_2^2=\frac89$
- $\pi_1=\pi_2=\frac{1.5}3=0.5$

$e^{-8}$을 버리지 않고 계산하면 $\mu\approx(0.6676,\,3.3324)$, $\sigma^2\approx0.8913$이다. 로그 가능도는 $-6.142$에서 $-5.461$로 늘었다.

**(c)** $\partial\mathcal L/\partial\mu_k=\sum_nr_{nk}(x_n-\mu_k)^\top\Sigma_k^{-1}$인데 $r_{nk}$가 모든 $\mu_j,\Sigma_j,\pi_j$에 의존한다(로그 안에 합이 있어 매개변수들이 묶인다). 그래서 한꺼번에 푸는 닫힌 해가 없다. EM은 $r_{nk}$를 고정하고 나머지를 닫힌 꼴로 갱신하는 일을 반복한다. 교재: EM의 각 단계는 로그 가능도를 늘린다(줄이지 않는다). 다만 국소 최적점으로 가며 초기값에 따라 결과가 다르다.

**(d)** K-평균. 책임도를 0/1로 정하는 것이 "가장 가까운 중심에 배정", 평균 갱신이 "중심 다시 계산"에 해당한다.

**채점 포인트:** 책임도 분모에 모든 성분의 합, $N_k$로 나누기, 분산 갱신에 새 $\mu_k$ 사용.
**교재 근거:** 11.2.1절(책임도), 11.3절 식 (11.53)~(11.56), 11.5절(K-평균과의 관계).

### 2-A6

**(a)** $f(x)=x_1+x_2-1$. $y_nf(x_n)$: $(2,0)\to1$, $(0,2)\to1$, $(3,3)\to5$, $(0,0)\to(-1)(-1)=1$. 모두 1 이상이다.
마진 $=\dfrac1{\|w\|}=\dfrac1{\sqrt2}\approx0.707$ (등호인 점에서 초평면까지 거리 $|w^\top x+b|/\|w\|$). 두 경계선 $x_1+x_2=0$과 $x_1+x_2=2$ 사이 폭은 $2/\|w\|=\sqrt2$.

**(b)** 등호가 성립하는 $(2,0),(0,2),(0,0)$이 서포트 벡터다. $(3,3)$은 $yf=5>1$이라 상보 여유성으로 $\alpha=0$.
$w=\alpha_1(2,0)+\alpha_2(0,2)-\alpha_4(0,0)=(2\alpha_1,2\alpha_2)=(1,1)$ → $\alpha_1=\alpha_2=\frac12$. $\sum\alpha_ny_n=\frac12+\frac12-\alpha_4=0$ → $\alpha_4=1$.
쌍대 목적(최대화 꼴) $\sum\alpha_n-\frac12\big\|\sum\alpha_ny_nx_n\big\|^2=2-\frac12\cdot2=1$, 원 목적 $\frac12\|w\|^2=1$. 같다. 교재 (12.41)은 부호를 바꾼 최소화 꼴이라 최솟값이 $-1$로 나온다.
$b$ 확인 (12.42): 서포트 벡터 $(2,0)$에서 $b=y-w^\top x=1-2=-1$.

**(c)** 
| 점 | $f$ | $yf$ | 힌지 손실 | 위치 |
|---|---|---|---|---|
| $(1,0.5)$, $y=-1$ | $0.5$ | $-0.5$ | $1.5$ | 오분류 ($yf<0$, $\xi>1$) |
| $(0.5,0.25)$, $y=-1$ | $-0.25$ | $0.25$ | $0.75$ | 바르게 분류됐지만 마진 안 ($0<\xi<1$) |

**(d)** $\phi(x)=(x_1^2,\ \sqrt2x_1x_2,\ x_2^2)^\top$. $(x^\top z)^2=x_1^2z_1^2+2x_1x_2z_1z_2+x_2^2z_2^2=\phi(x)^\top\phi(z)$.
$x=(1,2)$, $z=(3,1)$: $x^\top z=5$이라 $k=25$. $\phi(x)=(1,2\sqrt2,4)$, $\phi(z)=(9,3\sqrt2,1)$, 내적 $9+12+4=25$.

**채점 포인트:** 마진은 $1/\|w\|$, 서포트 벡터만 $\alpha>0$, $\sum\alpha_ny_n=0$ 사용, 힌지 손실과 위치 분류.
**교재 근거:** 12.2.1~12.2.3절 식 (12.18), 12.3.1절 식 (12.38)·(12.41)·(12.42), 12.2.5절 식 (12.31), 12.4절(커널).

---

## Part 1 B형

### 1-B1

**(a)** $U=\ker\,[1\ 2\ {-1}]$이다. 직접 확인: $0\in U$. $x,y\in U$이면 $(x_1+y_1)+2(x_2+y_2)-(x_3+y_3)=0+0=0$. $\alpha x$도 같은 식으로 0. 따라서 부분공간이다.
$x_3=x_1+2x_2$로 두면 기저 $\{(1,0,1)^\top,(0,1,2)^\top\}$, $\dim U=2$.

**(b)** $A_\Phi=\begin{bmatrix}1&1&0\\0&1&-1\end{bmatrix}$. $x_1=-x_2$, $x_3=x_2$에서 $\ker\Phi=\operatorname{span}\{(-1,1,1)^\top\}$. 차원 정리로 $\operatorname{rk}\Phi=3-1=2$, 그래서 $\operatorname{Im}\Phi=\mathbb R^2$.
기저 변환(정리 2.20): $\tilde A_\Phi=T^{-1}A_\Phi S$, $S=[\tilde b_1\ \tilde b_2\ \tilde b_3]$, $T=[\tilde c_1\ \tilde c_2]$.
$A_\Phi S$의 열 $=\Phi(\tilde b_j)$: $(2,1),\ (1,0),\ (1,-1)$. $T^{-1}=\frac12\begin{bmatrix}1&1\\1&-1\end{bmatrix}$.

$$
\tilde A_\Phi=\begin{bmatrix}\frac32&\frac12&0\\[2pt]\frac12&\frac12&1\end{bmatrix}
$$

검산: $\Phi(\tilde b_1)=(2,1)=\frac32(1,1)+\frac12(1,-1)$.

**(c)** $\ker(A^\top A)=\ker(A)$를 보인다. $Ax=0$이면 $A^\top Ax=0$. 거꾸로 $A^\top Ax=0$이면 $x^\top A^\top Ax=\|Ax\|^2=0$이라 $Ax=0$. 두 행렬 모두 열이 $n$개이므로 차원 정리에서 $\operatorname{rk}(A^\top A)=n-\dim\ker(A^\top A)=n-\dim\ker(A)=\operatorname{rk}(A)$. ∎

**채점 포인트:** 부분공간 세 조건, 기저 변환 식의 순서($T^{-1}$이 왼쪽), $\|Ax\|^2=0$ 논리.
**교재 근거:** 2.4절(부분공간), 2.7.3절(핵과 상), 정리 2.20(기저 변환), 정리 2.24(차원 정리).

### 1-B2

**(a)** $A^\top=A$라 대칭이고, 행렬 곱이라 쌍선형이다. 양의 정부호: $x^\top Ax=2x_1^2-2x_1x_2+x_2^2=x_1^2+(x_1-x_2)^2\ge0$이고, 0이 되려면 $x_1=0$, $x_2=x_1=0$이어야 한다. 따라서 내적이다(고윳값 $\frac{3\pm\sqrt5}2>0$으로 확인해도 된다).

**(b)** $\langle e_1,e_2\rangle_A=a_{12}=-1$, $\|e_1\|_A^2=2$, $\|e_2\|_A^2=1$. $\cos\omega=\frac{-1}{\sqrt2}$, $\omega=\frac{3\pi}4$ (135°). 표준 내적에서는 90°인 두 벡터가 이 내적에서는 직교하지 않는다.

**(c)** $\pi(x)=\dfrac{\langle x,e_1\rangle_A}{\langle e_1,e_1\rangle_A}e_1$. $\langle x,e_1\rangle_A=x^\top Ae_1=(1,1)\cdot(2,-1)=1$ → $\pi(x)=\frac12e_1=(\frac12,0)^\top$.
직교여공간: $\langle e_1,y\rangle_A=e_1^\top Ay=2y_1-y_2=0$ → $\operatorname{span}\{(1,2)^\top\}$. 실제로 $x-\pi(x)=(\frac12,1)$이 이 공간에 있다.

**(d)** $c=\cos\theta$, $s=\sin\theta$.
$R^\top R=\begin{bmatrix}c^2+s^2&-cs+sc\\-sc+cs&s^2+c^2\end{bmatrix}=I$, $\det R=c^2+s^2=1$.
$\langle Rx,Ry\rangle=x^\top R^\top Ry=x^\top y$라 길이($x=y$)와 각도(내적/길이)가 보존된다.
$R(\alpha)R(\beta)=\begin{bmatrix}c_\alpha c_\beta-s_\alpha s_\beta&-(c_\alpha s_\beta+s_\alpha c_\beta)\\s_\alpha c_\beta+c_\alpha s_\beta&c_\alpha c_\beta-s_\alpha s_\beta\end{bmatrix}=R(\alpha+\beta)$ (삼각함수 덧셈정리). ∎

**채점 포인트:** 양의 정부호를 제곱의 합으로 보이기, 내적에 $A$를 넣어 각도·사영 계산, $R^\top R=I$.
**교재 근거:** 3.2절(정의 3.4, 대칭 양의 정부호 행렬과 내적), 3.4절(각도), 3.8절 식 (3.39)~(3.40)(일반 내적에서의 사영), 3.6절(직교여공간), 3.9절(회전).

### 1-B3

**(a)** $AA^\top=\begin{bmatrix}17&8\\8&17\end{bmatrix}$, 고윳값 25, 9 → $\sigma_1=5$, $\sigma_2=3$. $u_1=\frac1{\sqrt2}(1,1)^\top$, $u_2=\frac1{\sqrt2}(1,-1)^\top$.
$v_i=A^\top u_i/\sigma_i$: $v_1=\frac1{5\sqrt2}(5,5,0)=\frac1{\sqrt2}(1,1,0)^\top$, $v_2=\frac1{3\sqrt2}(1,-1,4)^\top$.
$v_3$는 $v_1,v_2$ 모두와 직교하는 단위벡터: $v_3=\frac13(2,-2,-1)^\top$ (검산 $Av_3=(6-4-2,\ 4-6+2)=0$, 즉 $\ker A$를 생성).
$U=[u_1\ u_2]$, $\Sigma=\begin{bmatrix}5&0&0\\0&3&0\end{bmatrix}$, $V=[v_1\ v_2\ v_3]$.

**(b)** $\hat A(1)=\sigma_1u_1v_1^\top=5\cdot\frac12\begin{bmatrix}1&1&0\\1&1&0\end{bmatrix}=\begin{bmatrix}2.5&2.5&0\\2.5&2.5&0\end{bmatrix}$.
$A-\hat A(1)=\sigma_2u_2v_2^\top$라 남은 특이값이 3 하나뿐이다: $\|A-\hat A(1)\|_2=\sigma_2=3$ (Eckart–Young), $\|A-\hat A(1)\|_F=3$.

**(c)** $A^\top A=V\Sigma^\top U^\top U\Sigma V^\top=V(\Sigma^\top\Sigma)V^\top$이므로 고윳값은 $\Sigma^\top\Sigma$의 대각 원소 $25,9,0$이다. $\|A\|_F^2=\operatorname{tr}(A^\top A)=$ 고윳값의 합 $=\sum\sigma_i^2=34$. 원소 제곱합으로도 $9+4+4+4+9+4=34$.

**채점 포인트:** 작은 쪽($AA^\top$, $2\times2$)으로 계산, $v_i=A^\top u_i/\sigma_i$ 부호 일관성, $\ker A$ 벡터, Eckart–Young 오차.
**교재 근거:** 정리 4.22(SVD), 4.5.2절(SVD 만들기), 정리 4.24(스펙트럼 노름 = $\sigma_1$), 정리 4.25(Eckart–Young). 교재는 Eckart–Young을 스펙트럼 노름으로 서술한다. 프로베니우스 노름 결과는 교재 밖 보충이다.

### 1-B4

**(a)** $f=\sum_i\sum_jx_ia_{ij}x_j$. $\dfrac{\partial f}{\partial x_k}=\sum_ja_{kj}x_j+\sum_ix_ia_{ik}=(Ax)_k+(A^\top x)_k$. 행벡터로 모으면 $\dfrac{df}{dx}=\big((A+A^\top)x\big)^\top=x^\top(A+A^\top)$. ∎

**(b)** $L=\sum_i\big(y_i-\sum_jW_{ij}x_j\big)^2$, $\dfrac{\partial L}{\partial W_{ij}}=-2(y_i-(Wx)_i)x_j$. 모으면 $\dfrac{dL}{dW}=-2(y-Wx)x^\top$ ($W$와 같은 $2\times3$).
$Wx=(3,0)$, $y-Wx=(-2,2)$ → $-2\begin{bmatrix}-2\\2\end{bmatrix}[1\ 0\ 2]=\begin{bmatrix}4&0&8\\-4&0&-8\end{bmatrix}$ (수치 미분과 일치).

**(c)(i)** $z=(1-2,\ 0+2)=(-1,2)$, $h=(0,2)$, $\hat y=3\cdot0+1\cdot2=2$, $L=\frac12(2-1)^2=0.5$.
**(ii)** $\partial L/\partial\hat y=\hat y-y=1$.
- $\partial L/\partial w_2=1\cdot h=(0,2)$
- $\partial L/\partial h=1\cdot w_2=(3,1)$, ReLU 미분은 $z>0$일 때 1, 아니면 0 → $\partial L/\partial z=(3\cdot0,\ 1\cdot1)=(0,1)$
- $\partial L/\partial W_1=(\partial L/\partial z)\,x^\top=\begin{bmatrix}0&0\\1&2\end{bmatrix}$
- $\partial L/\partial x=W_1^\top(\partial L/\partial z)=(0,1)$

**(iii)** $W_1\leftarrow W_1-0.1\begin{bmatrix}0&0\\1&2\end{bmatrix}=\begin{bmatrix}1&-1\\-0.1&0.8\end{bmatrix}$. 새 순전파: $z=(-1,\ -0.1+1.6)=(-1,1.5)$, $h=(0,1.5)$, $\hat y=1.5$, $L=\frac12(0.5)^2=0.125$ (0.5에서 줄었다).

**채점 포인트:** 성분으로 미분한 뒤 모으기, 결과 모양 맞추기, ReLU에서 꺼진 뉴런($z_1<0$)의 기울기 0.
**교재 근거:** 5.5절 식 (5.107)(이차형식 미분), 5.6절(역전파).

### 1-B5

**(a)** $X=\sum_{i=1}^NB_i$, $B_i\sim\mathrm{Ber}(\mu)$ 독립. $\mathbb E[B_i]=\mu$, $B_i^2=B_i$라 $\mathbb V[B_i]=\mathbb E[B_i^2]-\mu^2=\mu(1-\mu)$. 선형성으로 $\mathbb E[X]=N\mu$, 독립이라 분산이 더해져 $\mathbb V[X]=N\mu(1-\mu)$. ∎

**(b)** 사후 $\propto\mu^7(1-\mu)^3\cdot\mu^{0}(1-\mu)^{2}=\mu^7(1-\mu)^5$ → $\mathrm{Beta}(8,6)$.
평균 $\frac8{14}=\frac47\approx0.571$, 최빈값 $\frac{8-1}{8+6-2}=\frac7{12}\approx0.583$, $\mu_{\text{ML}}=0.7$. 사전 평균 $\frac14$가 추정을 아래로 당겨 사후 평균이 사전 평균과 $\mu_{\text{ML}}$ 사이에 온다.

**(c)** $y=2x-1+\epsilon$, $\epsilon\sim\mathcal N(0,1)$은 $x$와 독립. $\mathbb E[y]=2(1)-1=1$, $\mathbb V[y]=4\cdot4+1=17$ → $p(y)=\mathcal N(1,17)$. $\operatorname{Cov}[x,y]=\operatorname{Cov}[x,2x]=2\cdot4=8$.
결합 공분산 $\begin{bmatrix}4&8\\8&17\end{bmatrix}$에서 $p(x\mid y=5)=\mathcal N(m,v)$:

$$
\begin{aligned}
m&=1+\tfrac8{17}(5-1)=\tfrac{49}{17}\approx2.882\\
v&=4-\tfrac{64}{17}=\tfrac4{17}\approx0.235
\end{aligned}
$$


**(d)** $x=e^{-y}$, $\left|\dfrac{dx}{dy}\right|=e^{-y}$. $y\in(0,\infty)$에서 $p_Y(y)=p_X(e^{-y})\,e^{-y}=e^{-y}$. 지수분포(모수 1)다.

**채점 포인트:** 독립이라 분산이 더해진다는 문장, 켤레 갱신 $(\alpha+h,\beta+t)$, 결합 공분산 만들기, 야코비안 절댓값.
**교재 근거:** 예제 6.9(이항분포), 6.4.4절(합과 변환), 예제 6.11(베타-이항 켤레), 식 (6.66)~(6.67), (6.88), 6.7절(변수 변환).

### 1-B6

**(a)** $f_x=4x^3-2y=0$, $f_y=2y-2x=0$ → $y=x$, $4x^3-2x=0$ → $x\in\{0,\pm\frac1{\sqrt2}\}$.
$H=\begin{bmatrix}12x^2&-2\\-2&2\end{bmatrix}$.
- $(0,0)$: $\begin{bmatrix}0&-2\\-2&2\end{bmatrix}$, $\det=-4<0$ (고윳값 $1\pm\sqrt5$, 부호가 섞임) → 안장점
- $\pm(\frac1{\sqrt2},\frac1{\sqrt2})$: $\begin{bmatrix}6&-2\\-2&2\end{bmatrix}$, $\det=8>0$, 대각합 $8>0$ → 양의 정부호, 극소. $f=\frac14+\frac12-1=-\frac14$

헤시안이 원점에서 양의 준정부호가 아니므로 $f$는 볼록이 아니다. 전역 최솟값: $f=x^4-x^2+(y-x)^2\ge x^4-x^2=(x^2-\frac12)^2-\frac14\ge-\frac14$, 등호는 위 두 점. 전역 최솟값 $-\frac14$.

**(b)** 제약 없는 최소점 $(2,1)$은 $2+1>2$라 제약을 어긴다 → 제약이 활성. KKT:
- 정류: $2(x_1-2)+\lambda=0$, $2(x_2-1)+\lambda=0$ → $x_1=x_2+1$
- 활성 제약 $x_1+x_2=2$와 합치면 $x=(1.5,\ 0.5)$, $\lambda=2(2-1.5)=1\ge0$ (쌍대 가능성)
- 원 가능성 $1.5+0.5\le2$, 상보 여유성 $\lambda(x_1+x_2-2)=0$

$f^*=0.25+0.25=0.5$.
쌍대: $\mathfrak L=(x_1-2)^2+(x_2-1)^2+\lambda(x_1+x_2-2)$를 $x$로 최소화하면 $x_1=2-\frac\lambda2$, $x_2=1-\frac\lambda2$.

$$
\begin{aligned}
\mathfrak D(\lambda)&=\frac{\lambda^2}4+\frac{\lambda^2}4+\lambda\Big(3-\lambda-2\Big)\\
&=\lambda-\frac{\lambda^2}2
\end{aligned}
$$

$\lambda=1$에서 최대 $\mathfrak D=0.5=f^*$. 강한 쌍대성이 성립한다. KKT 조건은 교재 본문에 따로 정리되어 있지 않고 12장 여백 주석에만 나온다(**교재 밖 보충**).

**(c)** $\varphi''(t)=1/t^2>0$이라 볼록이다. 젠센: $\varphi(\mathbb E[X])\le\mathbb E[\varphi(X)]$ → $-\log\mathbb E[X]\le-\mathbb E[\log X]$ → $\mathbb E[\log X]\le\log\mathbb E[X]$. ∎
확인: $X\in\{1,4\}$ 균등. $\mathbb E[\log X]=\frac12\ln4=\ln2\approx0.693$, $\log\mathbb E[X]=\ln2.5\approx0.916$.
교재 (7.30)은 두 점짜리(확률 $\theta$, $1-\theta$) 버전이고, 기댓값 버전은 같은 부등식을 확률가중합으로 넓힌 것이다(교재 여백 주석이 이런 부등식들을 모두 젠센 부등식이라 부른다고 언급).

**채점 포인트:** 정류점 세 개, 헤시안 판정 근거(행렬식·대각합 또는 고윳값), KKT 네 조건, 젠센 부등식 방향.
**교재 근거:** 5.7절(헤시안), 7.2절(라그랑주 쌍대), 7.3절 식 (7.30)~(7.31)(볼록 함수, 젠센).

---

## Part 2 B형

### 2-B1

**(a)** $\mathcal L(\lambda)=-\sum_n\log(\lambda e^{-\lambda x_n})=-N\log\lambda+\lambda\sum_nx_n$.
$\dfrac{d\mathcal L}{d\lambda}=-\dfrac N\lambda+\sum_nx_n=0$ → $\lambda_{\text{ML}}=\dfrac N{\sum_nx_n}=\dfrac1{\bar x}$. $\dfrac{d^2\mathcal L}{d\lambda^2}=\dfrac N{\lambda^2}>0$이라 음의 로그 가능도의 최소, 즉 가능도의 최대. 데이터: $4/8=0.5$.

**(b)** $-\log p(\theta\mid\mathcal X,\mathcal Y)=\dfrac1{2\sigma^2}\|y-\Phi\theta\|^2+\dfrac1{2b^2}\|\theta\|^2+\text{const}$. $2\sigma^2$를 곱하면 $\|y-\Phi\theta\|^2+\dfrac{\sigma^2}{b^2}\|\theta\|^2$ → $\lambda=\sigma^2/b^2$.

**(c)** 라플라스 사전분포 $p(\theta)=\prod_d\frac1{2b}e^{-|\theta_d|/b}$. 음의 로그 사후분포 $=\frac1{2\sigma^2}\|y-\Phi\theta\|^2+\frac1b\|\theta\|_1+\text{const}$. $2\sigma^2$를 곱하면 $\|y-\Phi\theta\|^2+\frac{2\sigma^2}b\|\theta\|_1$ (LASSO, $\lambda=2\sigma^2/b$). 교재 9.5절: 라플라스 사전분포를 둔 선형회귀는 $L_1$ 정규화(LASSO)와 같고, 라플라스 분포는 0에서 뾰족해 많은 매개변수를 정확히 0으로 만든다.

**채점 포인트:** 2계 조건 확인, 상수항 정리, $\lambda$를 $\sigma^2$와 $b$로 표현.
**교재 근거:** 8.3.1절(MLE), 9.2.3~9.2.4절 식 (9.31)·(9.32), 9.5절(LASSO).

### 2-B2

**(a)** 로그 사후분포를 $\theta$에 대한 이차식으로 정리한다.

$$
\begin{aligned}
&\log p(\theta\mid\mathcal X,\mathcal Y)\\
&=-\frac1{2\sigma^2}(y-\Phi\theta)^\top(y-\Phi\theta)\\
&\quad-\frac12(\theta-m_0)^\top S_0^{-1}(\theta-m_0)+\text{const}\\
&=-\frac12\Big[\theta^\top(\sigma^{-2}\Phi^\top\Phi+S_0^{-1})\theta\\
&\qquad-2\theta^\top(\sigma^{-2}\Phi^\top y+S_0^{-1}m_0)\Big]\\
&\quad+\text{const}
\end{aligned}
$$

가우시안의 로그 $-\frac12(\theta-m_N)^\top S_N^{-1}(\theta-m_N)=-\frac12\big[\theta^\top S_N^{-1}\theta-2\theta^\top S_N^{-1}m_N\big]+\text{const}$와 이차항·일차항을 맞추면
$S_N^{-1}=\sigma^{-2}\Phi^\top\Phi+S_0^{-1}$, $S_N^{-1}m_N=\sigma^{-2}\Phi^\top y+S_0^{-1}m_0$.

**(b)** $\Phi=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix}$, $\Phi^\top\Phi=\begin{bmatrix}3&3\\3&5\end{bmatrix}$, $\Phi^\top y=(7,10)^\top$.
$S_N=\begin{bmatrix}4&3\\3&6\end{bmatrix}^{-1}=\frac1{15}\begin{bmatrix}6&-3\\-3&4\end{bmatrix}=\begin{bmatrix}\frac25&-\frac15\\-\frac15&\frac4{15}\end{bmatrix}$.
$m_N=S_N\Phi^\top y=\frac1{15}(42-30,\ -21+40)=\left(\frac45,\ \frac{19}{15}\right)\approx(0.8,\ 1.267)$.
$\theta_{\text{ML}}=\frac16\begin{bmatrix}5&-3\\-3&3\end{bmatrix}\begin{bmatrix}7\\10\end{bmatrix}=\left(\frac56,\ \frac32\right)\approx(0.833,\ 1.5)$. $m_N$은 사전 평균 0 쪽으로 줄어 있고, $\lambda=\sigma^2/b^2=1$인 릿지 해와 같다.

**(c)** $\phi_*=(1,3)^\top$. 평균 $\phi_*^\top m_N=\frac45+\frac{57}{15}=\frac{23}5=4.6$.
$\phi_*^\top S_N\phi_*=\frac1{15}(6-18+36)=\frac85=1.6$. 분산 $=1.6+\sigma^2=2.6$.
$p(y_*\mid\mathcal X,\mathcal Y,x_*=3)=\mathcal N(4.6,\ 2.6)$. 매개변수 불확실성 몫은 $\phi_*^\top S_N\phi_*=1.6$, 나머지 1은 관측 잡음이다.

**(d)** $p(\mathcal Y\mid\mathcal X)=\int\mathcal N(y\mid\Phi\theta,\sigma^2I)\,\mathcal N(\theta\mid m_0,S_0)\,d\theta=\mathcal N(y\mid\Phi m_0,\ \Phi S_0\Phi^\top+\sigma^2I)$.
여기서는 $\mathcal N\!\left(0,\ \begin{bmatrix}2&1&1\\1&3&3\\1&3&6\end{bmatrix}\right)$. 모델 비교(베이즈 모델 선택)와 사전분포 같은 하이퍼파라미터를 고르는 데 쓴다.

**채점 포인트:** 제곱 완성으로 이차항·일차항 맞추기, $S_N$ 역행렬, 예측 분산의 두 몫.
**교재 근거:** 9.3.3절 식 (9.43)~(9.50), 9.3.4절 식 (9.57), 9.3.5절(주변 가능도), 8.6.2절.

### 2-B3

**(a)** 정규직교기저로 $x=\sum_{d=1}^D(b_d^\top x)b_d$, 사영 $\tilde x=\sum_{m\le M}(b_m^\top x)b_m$. 그러면 $x-\tilde x=\sum_{j>M}(b_j^\top x)b_j$이고 직교성 때문에 $\|x-\tilde x\|^2=\sum_{j>M}(b_j^\top x)^2$.

$$
\begin{aligned}
J_M&=\frac1N\sum_n\sum_{j>M}b_j^\top x_nx_n^\top b_j\\
&=\sum_{j>M}b_j^\top Sb_j
\end{aligned}
$$

각 $b_j^\top Sb_j$를 $\|b_j\|=1$ 아래에서 라그랑주로 다루면 $Sb_j=\lambda_jb_j$이고 값은 $\lambda_j$다. 합을 최소로 하려면 버리는 방향에 가장 작은 $D-M$개의 고윳값을 배정해야 하므로 최솟값은 $\sum_{j=M+1}^D\lambda_j$이고, 남기는 공간은 상위 $M$개 고유벡터가 생성하는 주부분공간이다.

**(b)** $X^\top X=\begin{bmatrix}9&-9\\-9&9\end{bmatrix}$, $\frac1NX^\top X=\begin{bmatrix}4.5&-4.5\\-4.5&4.5\end{bmatrix}$: 고윳값 9(고유벡터 $c=\frac1{\sqrt2}(1,-1)$), 0.
$\frac1NX^\top Xc=\lambda c$의 양변 왼쪽에 $X$를 곱하면 $\frac1NXX^\top(Xc)=\lambda(Xc)$. 그래서 $Xc=\frac1{\sqrt2}(2,4,4)$가 $S$의 고유벡터이고 고윳값도 $\lambda_1=9$. 정규화: $u_1=\frac13(1,2,2)^\top$.

**(c)** $X=U\Sigma V^\top$이면 $S=\frac1NU\Sigma\Sigma^\top U^\top$, 따라서 $\lambda_d=\sigma_d^2/N$. $\sigma_1=\sqrt{N\lambda_1}=\sqrt{18}=3\sqrt2\approx4.243$ ($\|X\|_F^2=18$과도 맞는다).

**(d)** $BB^\top$은 고윳값 $\|B\|^2=9$(고유벡터 $B/\|B\|=\frac13(1,2,2)$)와 0 두 개를 가진다. $\sigma^2I$를 더하면 모든 고윳값이 0.5씩 올라가 $9.5,\ 0.5,\ 0.5$. 가장 큰 고유벡터 $\frac13(1,2,2)$가 (b)의 주성분 방향과 같다. PPCA는 데이터를 $B$ 방향(주부분공간)으로 퍼뜨리고 모든 방향에 같은 크기의 잡음 $\sigma^2$를 더하는 모델이다.

**채점 포인트:** 직교성으로 교차항 소거, $b_j^\top Sb_j$ 꼴, $N<D$에서 $Xc$가 고유벡터인 이유, $\lambda=\sigma^2/N$.
**교재 근거:** 10.3절 식 (10.44), 10.4절 식 (10.47)~(10.51), 10.5절($N\gg D$가 아닐 때), 10.7절(PPCA).

### 2-B4

**(a)** 혼합 밀도를 $p(x_n)=\sum_j\pi_j\mathcal N(x_n\mid\mu_j,\Sigma_j)$로 줄여 쓰면

$$
\frac{\partial\mathcal L}{\partial\mu_k}=\sum_n\frac{\pi_k}{p(x_n)}\,\frac{\partial\mathcal N(x_n\mid\mu_k,\Sigma_k)}{\partial\mu_k}
$$

이고, 가우시안을 평균으로 미분하면

$$
\begin{aligned}
&\frac{\partial\mathcal N(x_n\mid\mu_k,\Sigma_k)}{\partial\mu_k}\\
&=\mathcal N(x_n\mid\mu_k,\Sigma_k)\,(x_n-\mu_k)^\top\Sigma_k^{-1}
\end{aligned}
$$

이다. 책임도가 $r_{nk}=\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)/p(x_n)$이므로 $\dfrac{\partial\mathcal L}{\partial\mu_k}=\sum_nr_{nk}(x_n-\mu_k)^\top\Sigma_k^{-1}=0$. 오른쪽에 $\Sigma_k$를 곱하면 $\sum_nr_{nk}x_n=\mu_k\sum_nr_{nk}$ → $\mu_k=\frac1{N_k}\sum_nr_{nk}x_n$.

**(b)** $\mathfrak L=\mathcal L+\lambda\big(\sum_k\pi_k-1\big)$.
$\dfrac{\partial\mathfrak L}{\partial\pi_k}=\sum_n\dfrac{\mathcal N(x_n\mid\mu_k,\Sigma_k)}{\sum_j\pi_j\mathcal N(x_n\mid\mu_j,\Sigma_j)}+\lambda=\dfrac{N_k}{\pi_k}+\lambda=0$ → $\pi_k=-N_k/\lambda$. 합이 1이므로 $-N/\lambda=1$, $\lambda=-N$ → $\pi_k=N_k/N$.

**(c)** 분자: $0.4\times0.2420=0.0968$, $0.6\times0.1210=0.0726$, 합 $0.1694$. $r_1=0.0968/0.1694\approx0.571$, $r_2\approx0.429$. (정확히는 $\mathcal N(1\mid3,4)=\frac12\mathcal N(1\mid0,1)$이라 $r_1=\frac{0.4}{0.4+0.3}=\frac47$.) $x=1$은 $\mu_1=0$에 더 가깝지만 성분 2의 혼합 비율과 분산이 커서 책임도가 반반에 가깝다.

**(d)** 한 성분의 평균을 데이터 점 하나에 맞추고($\mu_k=x_n$) 분산을 0으로 줄이면 $\mathcal N(x_n\mid\mu_k,\sigma^2I)=(2\pi\sigma^2)^{-D/2}\to\infty$다. 다른 점들은 다른 성분이 유한한 밀도로 설명하므로 전체 로그 가능도가 무한대로 간다. 그래서 GMM의 최대가능도 문제는 잘 정의되지 않을 수 있다(교재 11.5절). 실전에서 분산 하한을 두거나 사전분포(MAP)를 쓰는 대처는 **교재 밖 보충**이다.

**채점 포인트:** 가우시안 미분, 책임도가 자연스럽게 나오는 과정, 라그랑주 승수 $\lambda=-N$.
**교재 근거:** 11.2.2~11.2.4절(평균·공분산·혼합 비율 갱신, 식 (11.42)), 11.5절.

### 2-B5

**(a)** 라그랑지안($\alpha_n,\gamma_n\ge0$):

$$
\begin{aligned}
\mathfrak L&=\tfrac12\|w\|^2+C\sum_n\xi_n\\
&\quad-\sum_n\alpha_n\big(y_n(w^\top x_n+b)-1+\xi_n\big)\\
&\quad-\sum_n\gamma_n\xi_n
\end{aligned}
$$

- $\partial_w$: $w=\sum_n\alpha_ny_nx_n$
- $\partial_b$: $\sum_n\alpha_ny_n=0$
- $\partial_{\xi_n}$: $C-\alpha_n-\gamma_n=0$ → $\alpha_n=C-\gamma_n\le C$

대입하면 $\xi$ 항이 모두 사라지고 $\mathfrak D(\alpha)=\sum_i\alpha_i-\frac12\sum_i\sum_jy_iy_j\alpha_i\alpha_jx_i^\top x_j$. 쌍대 문제는 이를 $\sum_iy_i\alpha_i=0$, $0\le\alpha_i\le C$ 아래에서 최대화하는 것이다(교재 (12.41)은 부호를 바꾼 최소화 꼴).

**(b)** $(w,b)$를 고정하면 $\xi_n$에 대한 제약은 $\xi_n\ge1-y_nf_n$과 $\xi_n\ge0$이고 목적은 $\xi_n$이 작을수록 좋다. 그래서 최적 $\xi_n=\max\{0,1-y_nf_n\}$이고 대입하면 힌지 손실 꼴이다.

**(c)** 상보 여유성: $\alpha_n\big(y_nf_n-1+\xi_n\big)=0$, $\gamma_n\xi_n=0$ ($\gamma_n=C-\alpha_n$).
- $\alpha_n=0$: $\gamma_n=C>0$ → $\xi_n=0$, $y_nf_n\ge1$ → 마진 경계 위나 바깥(올바른 쪽). 서포트 벡터가 아니다.
- $0<\alpha_n<C$: $\gamma_n>0$ → $\xi_n=0$, $\alpha_n>0$ → $y_nf_n=1$ → 정확히 마진 경계 위.
- $\alpha_n=C$: $\gamma_n=0$ → $\xi_n\ge0$, $y_nf_n=1-\xi_n\le1$ → 마진 안($0<\xi_n<1$)이거나 오분류($\xi_n>1$).

**(d)** $f(x)=x_1-x_2$.
| 점 | $y_nf$ | 힌지 손실 |
|---|---|---|
| $(2,0)$, $+1$ | 2 | 0 |
| $(0.5,0)$, $+1$ | 0.5 | 0.5 |
| $(0,1)$, $-1$ | 1 | 0 |
| $(1,0)$, $-1$ | $-1$ | 2 |

목적값 $=\frac12\cdot2+1\cdot(0+0.5+0+2)=3.5$.
최적이라면: $\alpha_1=0$($yf>1$), $\alpha_2=\alpha_4=C=1$($\xi>0$), $\alpha_3\in[0,1]$(경계 위). $\sum\alpha_ny_n=\alpha_2-\alpha_3-\alpha_4=-\alpha_3=0$ → $\alpha_3=0$. 그러면 $w=\sum\alpha_ny_nx_n=(0.5,0)-(1,0)=(-0.5,0)\ne(1,-1)$. 모순이므로 **이 $(w,b)$는 최적이 아니다.**
(참고: 이차계획으로 푼 실제 최적해는 $w=(0.7,-0.6)$, $b=-0.4$, $\alpha=(0.6,1,0.6,1)$, 목적값 2.775다. $(2,0)$과 $(0,1)$은 $0<\alpha<C$이고 $yf=1$, 나머지 두 점은 $\alpha=C$이고 $yf<1$로 (c)와 맞는다. 세 점 $(0.5,0)^+,(1,0)^-,(2,0)^+$이 한 직선 위에 $+,-,+$ 순서로 있어 선형 분리가 안 되므로 소프트 마진이 필요하다.)

**채점 포인트:** $\gamma_n$을 포함한 라그랑지안, $\alpha_n\le C$가 나오는 줄, 상보 여유성 경우 나누기, KKT로 최적성 판정.
**교재 근거:** 12.2.4~12.2.5절 식 (12.26a)·(12.31), 12.3.1절 식 (12.34)~(12.41).

### 2-B6

**(1)** $\theta_{\text{ML}}$은 정규방정식 $\Phi^\top(y-\Phi\theta)=0$을 푼다. 잔차가 $\Phi$의 모든 열과 직교하므로 $\Phi\theta_{\text{ML}}=\Phi(\Phi^\top\Phi)^{-1}\Phi^\top y$는 사영행렬 (3.59)를 $y$에 곱한 것, 즉 열공간에서 $y$에 가장 가까운 점이다. 최소제곱 $\min\|y-\Phi\theta\|$와 같은 말이다(9.4절).

**(2)** 중심화한 $X\in\mathbb R^{D\times N}$을 $X=U\Sigma V^\top$로 분해하면 $S=\frac1NU\Sigma\Sigma^\top U^\top$. 주성분 방향은 왼쪽 특이벡터($U$의 열)이고 $\lambda_d=\sigma_d^2/N$이다. 상위 $M$개로 사영해 복원한 $\tilde X_M=U_M\Sigma_MV_M^\top$은 Eckart–Young 정리에 따라 계수 $M$ 이하 행렬 가운데 $X$에 가장 가까운 행렬이라 재구성 오차가 최소다(10.4절).

**(3)** GMM+EM: 책임도로 **부드럽게** 배정, 평균·공분산·혼합 비율을 모두 학습, 확률 모델이라 가능도로 비교할 수 있다. K-평균: 가장 가까운 중심에 **딱 잘라** 배정하고 평균만 갱신한다. 교재 11.5절: GMM에서 공분산을 무시하면(단위행렬로 두면) K-평균이 된다. 둘 다 국소 최적이고 초기값에 민감하다.

**(4)** 쌍대는 데이터가 내적 $x_i^\top x_j$로만 들어가서 이를 커널 $k(x_i,x_j)=\langle\phi(x_i),\phi(x_j)\rangle$로 바꿀 수 있다(특징 $\phi$를 직접 계산하지 않아도 되고 무한 차원도 된다). 변수 수가 특징 차원 $D$가 아니라 데이터 수 $N$이며, 서포트 벡터만 $\alpha>0$이다. 유효한 커널은 대칭이고 어떤 데이터에서도 그람 행렬이 양의 준정부호여야 한다(12.4절).
그람 행렬 $K=\begin{bmatrix}1&0&1\\0&1&1\\1&1&4\end{bmatrix}$: 선행 주소행렬식 $1,\ 1,\ \det K=1(4-1)-0+1(0-1)=2$가 모두 양수라 양의 정부호(따라서 준정부호). 일반적으로도 $z^\top Kz=\big\|\sum_iz_i\phi(x_i)\big\|^2\ge0$이다. (수치로 고윳값 $0.438,\ 1,\ 4.562$.)

**(5)** 바깥 고리는 데이터를 $K$개로 나눠 한 조각을 시험용으로 남기고, 안쪽 고리는 나머지로 교차검증을 돌려 모델·하이퍼파라미터를 고른다. 고른 결과를 바깥 시험 조각에서 평가하고 평균한 값을 일반화 성능으로 보고한다. 선택에 쓴 교차검증 점수를 그대로 보고하면, 잡음이 섞인 여러 추정값 가운데 가장 좋은 것을 고른 셈이라 낙관적으로 치우친다(8.6.1절).

**교재 근거:** 9.4절, 10.4절, 11.5절, 12.4절, 8.6.1절.
