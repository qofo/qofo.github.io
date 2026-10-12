---
title: "MML 3장 해석기하: 노름, 내적, 직교사영"
slug: "mml-ch03-analytic-geometry"
date: 2026-10-12
weight: 3
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "해석기하", "내적", "직교사영", "그람-슈미트"]
description: "MML 3장(교재 70~97쪽) 해설. 노름과 내적, 길이·거리·각도, 정규직교기저와 그람-슈미트, 부분공간으로의 직교사영, 회전을 손계산 예제와 연습문제 3.1~3.10 풀이로 정리했다."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재 70~97쪽.** 2장에서 다룬 벡터공간에 "길이·거리·각도"를 재는 도구(노름, 내적)를 붙인다. 이 장의 직교사영은 **9장 선형회귀(최대가능도 해 = 열공간으로의 직교사영)**, **10장 PCA(데이터를 부분공간에 사영)**, **12장 SVM(점과 초평면 사이 거리)**\ 에서 그대로 다시 나온다. 대칭 양의 정부호 행렬은 4장(숄레스키, 고유값), 6장(공분산 행렬)으로 이어진다.

---

## 0. 이 장 지도

**흐름:** 길이(노름, 3.1) → 길이와 각도를 함께 주는 내적(3.2) → 내적으로 잰 길이·거리(3.3), 각도·직교(3.4) → 서로 직교하는 기저(3.5) → 부분공간에 직교하는 공간(3.6) → 함수의 내적(3.7) → **직교사영(3.8, 이 장의 핵심)** → 회전(3.9)

| 절 | 핵심 한 줄 | 중요도 | 뒤에서 쓰이는 곳 |
|---|---|---|---|
| 3.1 노름 | 길이의 공리 3개, $\ell_1$·$\ell_2$ | ★★ | 8·9장 정규화(L1/L2) |
| 3.2 내적 | 쌍선형·대칭·양의 정부호, $\langle x,y\rangle=\hat x^\top A\hat y$ | ★★★ | 12장 커널, 6장 공분산 |
| 3.3 길이와 거리 | $\|x\|=\sqrt{\langle x,x\rangle}$, 코시-슈바르츠 | ★★ | 전체 |
| 3.4 각도와 직교 | $\cos\omega=\frac{\langle x,y\rangle}{\|x\|\|y\|}$, 직교행렬 | ★★★ | 4장 SVD, 회전 |
| 3.5 정규직교기저 | 서로 수직인 단위벡터 기저 | ★★ | 4장 스펙트럼 정리, 10장 |
| 3.6 직교여공간 | $U^\perp$, 법선벡터 | ★★ | 10장, 12장 초평면 |
| 3.7 함수의 내적 | $\int u(x)v(x)dx$ | ★ | 푸리에 급수(참고) |
| 3.8 직교사영 | $\pi_U(x)=B(B^\top B)^{-1}B^\top x$, 그람-슈미트 | ★★★ | 9장, 10장, 12장 |
| 3.9 회전 | 회전행렬, 거리·각도 보존 | ★ | 로봇·그래픽(참고) |

중요도는 "뒤쪽 장에서 다시 쓰이는가, 교재가 정리·예제로 강조하는가"로만 매겼다.

---

## 3.1 노름 (Norms, 71쪽)

### 왜 필요한가
벡터의 "크기"를 재는 방법이 하나만 있는 것이 아니다. 머신러닝에서는 매개변수 크기에 벌점을 줄 때(정규화) 어떤 노름을 쓰느냐에 따라 결과가 달라진다(L2 = 릿지, L1 = 라쏘).

### 정의와 성질
노름(norm) $\|\cdot\|:V\to\mathbb R$은 모든 벡터 $x,y$와 스칼라 $\lambda$에 대해 다음을 만족하는 함수다(정의 3.1):
1. **절대 동차성(absolutely homogeneous):** $\|\lambda x\|=|\lambda|\,\|x\|$ (2배로 늘리면 길이도 2배)
2. **삼각부등식(triangle inequality):** $\|x+y\|\le\|x\|+\|y\|$ (돌아가는 길이 질러가는 길보다 짧을 수 없다)
3. **양의 정부호(positive definite):** $\|x\|\ge0$이고, $\|x\|=0\iff x=0$

대표적인 노름:
- **맨해튼 노름(Manhattan, $\ell_1$):** $\|x\|_1=\sum_i|x_i|$ (격자 도로를 따라 걷는 거리)
- **유클리드 노름(Euclidean, $\ell_2$):** $\|x\|_2=\sqrt{\sum_ix_i^2}=\sqrt{x^\top x}$ (직선 거리). 교재는 특별한 말이 없으면 이것을 쓴다.

"길이가 1인 벡터 전체"를 그리면 $\ell_2$는 원, $\ell_1$은 마름모(꼭짓점이 축 위)다. 라쏘(L1)가 희소한 해(0이 많은 해)를 주는 이유가 이 마름모의 뾰족한 꼭짓점과 관련 있다(교재 밖 보충).

### 손으로 풀어 보는 예제
$x=[3,-4]^\top$: $\|x\|_1=|3|+|-4|=7$, $\|x\|_2=\sqrt{9+16}=5$. ($\|x\|_\infty=\max_i|x_i|=4$도 있다. 교재 밖 보충.)

### 헷갈리는 점
- $\ell_1$과 $\ell_2$는 같은 벡터에 다른 값을 준다. 문제에 어떤 노름인지 적혀 있는지 본다.
- 노름은 내적이 없어도 정의할 수 있다. 하지만 내적이 있으면 그 내적에서 나오는 노름이 자동으로 생긴다(3.3). $\ell_1$ 노름은 어떤 내적에서도 나오지 않는다.

---

## 3.2 내적 (Inner Products, 72쪽)

### 왜 필요한가
내적 하나로 길이, 거리, 각도, 직교를 모두 정의할 수 있다. 그리고 "어떤 내적을 쓰느냐"를 바꾸면 기하 구조 자체가 바뀐다. 12장의 커널은 "고차원 특징 공간에서의 내적"을 계산하는 함수다.

### 3.2.1 점곱 (Dot Product)
$$x^\top y=\sum_{i=1}^nx_iy_i.$$
가장 익숙한 내적이다. 교재는 이것을 "점곱(dot product)"이라 부르고, 내적을 더 일반적인 개념으로 정의한다.

### 3.2.2 일반 내적 (General Inner Products)
**쌍선형(bilinear):** 두 입력 각각에 대해 선형인 함수 $\Omega(x,y)$:
$$\Omega(\lambda x+\psi y,z)=\lambda\Omega(x,z)+\psi\Omega(y,z),\qquad \Omega(x,\lambda y+\psi z)=\lambda\Omega(x,y)+\psi\Omega(x,z).$$

**정의 3.2–3.3:** 쌍선형 사상 $\Omega:V\times V\to\mathbb R$이
- **대칭(symmetric):** $\Omega(x,y)=\Omega(y,x)$
- **양의 정부호(positive definite):** $x\ne0$이면 $\Omega(x,x)>0$, 그리고 $\Omega(0,0)=0$
이면 **내적(inner product)**\ 이라 하고 $\langle x,y\rangle$로 쓴다. 내적이 붙은 벡터공간을 내적공간(inner product space), 점곱을 쓰면 유클리드 벡터공간이라 한다.

**점곱이 아닌 내적의 예(교재 예제 3.3):** $\mathbb R^2$에서
$$\langle x,y\rangle=x_1y_1-(x_1y_2+x_2y_1)+2x_2y_2.$$
행렬로 쓰면 $x^\top\begin{bmatrix}1&-1\\-1&2\end{bmatrix}y$이고, 이 행렬이 아래 3.2.3의 "대칭 양의 정부호"라서 내적이 된다. (교재 연습문제 3.1이 이것이 내적임을 보이라는 문제다.)

### 3.2.3 대칭 양의 정부호 행렬 (Symmetric, Positive Definite Matrices)
**정의 3.4:** 대칭행렬 $A\in\mathbb R^{n\times n}$이 모든 $x\ne0$에 대해
$$x^\top Ax>0$$
이면 **대칭 양의 정부호(SPD, symmetric positive definite)**, $\ge0$이면 양의 준정부호(positive semidefinite)라 한다.

**정리 3.5 (내적 ↔ SPD 행렬):** 유한차원 공간에서 기저를 하나 고정하면, $\langle\cdot,\cdot\rangle$이 내적인 것과
$$\langle x,y\rangle=\hat x^\top A\hat y\qquad(\hat x,\hat y\text{는 좌표벡터})$$
를 만족하는 SPD 행렬 $A$가 존재하는 것은 같은 말이다. 여기서 $A_{ij}=\langle b_i,b_j\rangle$이다. 즉 **"내적을 고른다" = "SPD 행렬을 고른다"**.

**SPD 행렬의 성질 (교재 정리):**
- 핵(영공간)이 $\{0\}$이다. ($x\ne0$이면 $x^\top Ax>0$이라 $Ax\ne0$.) 그래서 역행렬이 있다.
- 대각 원소가 모두 양수다($a_{ii}=e_i^\top Ae_i>0$).

**SPD 판정(2×2, 실전용):** $\begin{bmatrix}a&b\\b&c\end{bmatrix}$가 SPD $\iff a>0$이고 $ac-b^2>0$. 일반적으로는 **모든 고유값이 양수**인 것과 같다(4장). (2×2 공식은 교재 밖 보충, 고유값 판정은 4장 내용.)

### 손으로 풀어 보는 예제
**(1) SPD인가?** $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$.
$x^\top Ax=2x_1^2+2x_1x_2+2x_2^2=x_1^2+x_2^2+(x_1+x_2)^2$. 세 제곱의 합이고, 모두 0이려면 $x_1=x_2=0$뿐이다. **SPD.** (고유값 3, 1 모두 양수.)

**(2) SPD가 아닌 예:** $A=\begin{bmatrix}1&2\\2&1\end{bmatrix}$. $x=[1,-1]^\top$이면 $x^\top Ax=1-2-2+1=-2<0$. **SPD 아님.** (고유값 3, −1.)

**(3) 이 내적으로 길이 재기:** $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$로 정한 내적에서 $x=[1,0]^\top$의 길이는 $\sqrt{x^\top Ax}=\sqrt2$. 점곱으로는 1이다. 같은 벡터도 내적에 따라 길이가 다르다.

### 헷갈리는 점
- 대칭이 아니면 내적이 아니다. 교재 연습문제 3.2의 $A=\begin{bmatrix}2&0\\1&2\end{bmatrix}$는 대칭이 아니라 $\langle x,y\rangle\ne\langle y,x\rangle$가 되어 **내적이 아니다**($x=e_1,y=e_2$면 $\langle e_1,e_2\rangle=0$, $\langle e_2,e_1\rangle=1$).
- 대각 원소가 모두 양수여도 SPD가 아닐 수 있다(예 (2)).

---

## 3.3 길이와 거리 (Lengths and Distances, 75쪽)

### 정의와 성질
- 내적이 있으면 **유도된 노름(induced norm)** $\|x\|=\sqrt{\langle x,x\rangle}$가 생긴다.
- **코시-슈바르츠 부등식(Cauchy–Schwarz):**
$$|\langle x,y\rangle|\le\|x\|\,\|y\|.$$
  덕분에 $\frac{\langle x,y\rangle}{\|x\|\|y\|}$가 항상 $[-1,1]$에 있어 각도를 정의할 수 있다(3.4).
- **거리(distance):** $d(x,y)=\|x-y\|=\sqrt{\langle x-y,x-y\rangle}$. 점곱을 쓰면 유클리드 거리.
- **거리 함수(metric)의 성질(정의 3.6):** ① 양의 정부호 $d(x,y)\ge0$, $d(x,y)=0\iff x=y$ ② 대칭 $d(x,y)=d(y,x)$ ③ 삼각부등식 $d(x,z)\le d(x,y)+d(y,z)$.
- 교재 주석: 내적과 거리는 정의가 비슷해 보이지만 **반대로 움직인다.** 비슷한 두 벡터는 내적이 크고 거리는 작다.

### 손으로 풀어 보는 예제 (교재 연습문제 3.3)
$x=[1,2,3]^\top$, $y=[-1,-1,0]^\top$, $x-y=[2,3,3]^\top$.
- (a) 점곱: $d=\sqrt{4+9+9}=\sqrt{22}$.
- (b) $A=\begin{bmatrix}2&1&0\\1&3&-1\\0&-1&2\end{bmatrix}$일 때 $d=\sqrt{(x-y)^\top A(x-y)}$.
  - $A(x-y)=[2\cdot2+1\cdot3,\ 1\cdot2+3\cdot3-1\cdot3,\ -1\cdot3+2\cdot3]^\top=[7,8,3]^\top$
  - $(x-y)^\top A(x-y)=2\cdot7+3\cdot8+3\cdot3=14+24+9=47$
  - $d=\sqrt{47}\approx6.86$.

---

## 3.4 각도와 직교 (Angles and Orthogonality, 76쪽)

### 정의와 성질
- **각도:** 0이 아닌 $x,y$에 대해
$$\cos\omega=\frac{\langle x,y\rangle}{\|x\|\,\|y\|},\qquad\omega\in[0,\pi].$$
  코시-슈바르츠 덕분에 오른쪽이 $[-1,1]$에 있어 $\omega$가 하나로 정해진다. 각도는 "방향이 얼마나 비슷한가"를 잰다(CLIP의 코사인 유사도가 이것이다).
- **직교(orthogonal, 정의 3.7):** $\langle x,y\rangle=0$이면 $x\perp y$. 길이도 1이면 정규직교(orthonormal). 영벡터는 모든 벡터와 직교한다.
- **중요:** 직교는 **내적에 따라 달라진다.** 점곱으로 직교인 두 벡터가 다른 내적에서는 직교가 아닐 수 있다(교재 예제 3.7).
- **직교행렬(orthogonal matrix, 정의 3.8):** 정사각행렬 $A$가 $AA^\top=I=A^\top A$, 즉 $A^{-1}=A^\top$. **열들이 정규직교**라는 뜻이다(이름은 "직교"지만 실제로는 정규직교).
  - 길이를 보존한다: $\|Ax\|^2=(Ax)^\top(Ax)=x^\top A^\top Ax=x^\top x=\|x\|^2$.
  - 각도를 보존한다: $\cos\omega=\frac{(Ax)^\top(Ay)}{\|Ax\|\|Ay\|}=\frac{x^\top y}{\|x\|\|y\|}$.
  - 회전(3.9)과 반사가 직교행렬이다.

### 손으로 풀어 보는 예제
**(1)** $x=[1,1]^\top$, $y=[1,0]^\top$(점곱): $\cos\omega=\frac{1}{\sqrt2\cdot1}$, $\omega=45^\circ=\pi/4$.

**(2) 교재 연습문제 3.4:** $x=[1,2]^\top$, $y=[-1,-1]^\top$.
- (a) 점곱: $\langle x,y\rangle=-1-2=-3$, $\|x\|=\sqrt5$, $\|y\|=\sqrt2$. $\cos\omega=\frac{-3}{\sqrt{10}}\approx-0.949$, $\omega\approx2.82$ rad $\approx161.6^\circ$.
- (b) $B=\begin{bmatrix}2&1\\1&3\end{bmatrix}$: $\langle x,y\rangle=x^\top By$. $By=[-3,-4]^\top$이라 $x^\top By=-3-8=-11$. $Bx=[4,7]^\top$, $x^\top Bx=4+14=18$. $y^\top By=3+4=7$. $\cos\omega=\frac{-11}{\sqrt{18\cdot7}}=\frac{-11}{\sqrt{126}}\approx-0.980$, $\omega\approx2.94$ rad $\approx168.5^\circ$. 같은 두 벡터라도 내적에 따라 각도가 다르다.

---

## 3.5 정규직교기저 (Orthonormal Basis, 78쪽)

### 정의
$n$차원 공간의 기저 $b_1,\dots,b_n$이
$$\langle b_i,b_j\rangle=0\ (i\ne j),\qquad\langle b_i,b_i\rangle=1$$
이면 **정규직교기저(ONB, orthonormal basis)**\ 다. 직교만 하면 직교기저(orthogonal basis).

### 왜 좋은가
- 좌표를 구할 때 연립방정식을 풀 필요가 없다. $x=\sum_i\lambda_ib_i$이면 양변에 $b_j$를 내적해 $\lambda_j=\langle x,b_j\rangle$.
- 사영 공식이 $B^\top B=I$로 단순해진다(3.8.2).
- 4장의 대칭행렬 스펙트럼 정리, SVD, 10장 PCA의 주성분이 모두 정규직교기저다.

### 만드는 방법
교재는 가우스 소거를 이용하는 방법을 소개하고(첨가행렬 $[\tilde B\tilde B^\top\,|\,\tilde B]$), 3.8.3에서 **그람-슈미트**로 다시 다룬다. 실전에서는 그람-슈미트를 쓴다.

**예(교재 예제 3.8과 같은 꼴):** $b_1=\frac1{\sqrt2}[1,1]^\top$, $b_2=\frac1{\sqrt2}[1,-1]^\top$은 $\mathbb R^2$의 ONB다. ($b_1^\top b_2=\frac12(1-1)=0$, $\|b_1\|=\|b_2\|=1$.)

---

## 3.6 직교여공간 (Orthogonal Complement, 79쪽)

### 정의와 성질
$D$차원 공간 $V$의 $M$차원 부분공간 $U$에 대해, $U$의 **모든** 벡터와 직교하는 벡터 전체를 **직교여공간(orthogonal complement)** $U^\perp$라 한다.
- $U^\perp$는 $(D-M)$차원 부분공간이다.
- $U\cap U^\perp=\{0\}$.
- 모든 $x\in V$는 "$U$ 성분 + $U^\perp$ 성분"으로 **유일하게** 분해된다:
$$x=\sum_{m=1}^M\lambda_mb_m+\sum_{j=1}^{D-M}\psi_jb_j^\perp.$$
- 3차원 공간의 평면 $U$는 $U^\perp$를 생성하는 단위 **법선벡터(normal vector)** $w$ 하나로 표현할 수 있다. "$w$와 직교하는 벡터 전체 = 평면 $U$". 고차원의 초평면도 같은 방식으로 표현한다(12장 SVM의 $w$가 법선벡터다).

### 예제
$\mathbb R^3$에서 $U=\text{span}[[1,0,1]^\top,[0,1,1]^\top]$이면 $U^\perp$는 두 벡터와 모두 직교하는 벡터, 즉 $x_1+x_3=0$, $x_2+x_3=0$의 해 $\text{span}[[1,1,-1]^\top]$ (1차원 = 3 − 2). 행렬 $B^\top$의 영공간과 같다: **$U^\perp=\ker(B^\top)$** ($B$의 열이 $U$의 기저일 때).

---

## 3.7 함수의 내적 (Inner Product of Functions, 80쪽)

벡터의 성분 합 $\sum_ix_iy_i$를 적분으로 바꾸면 함수의 내적이 된다:
$$\langle u,v\rangle=\int_a^bu(x)v(x)\,dx.$$
이 값이 0이면 두 함수는 직교한다. 교재 예제 3.9: $\sin x$와 $\cos x$는 $[-\pi,\pi]$에서 $\int_{-\pi}^{\pi}\sin x\cos x\,dx=0$이라 직교한다($\sin x\cos x$가 기함수). 더 나아가 $\{1,\cos x,\cos2x,\dots\}$가 서로 직교하는 것이 푸리에 급수의 바탕이다. 6장에서 확률변수의 공분산을 내적처럼 볼 때도 이 관점이 쓰인다.

---

## 3.8 직교사영 (Orthogonal Projections, 81쪽) — 이 장의 핵심

### 왜 필요한가
고차원 데이터를 저차원으로 줄일 때 정보를 가장 적게 잃는 방법이 "가장 가까운 점으로 옮기기", 즉 직교사영이다. 10장 PCA가 이것이고, 9장 선형회귀의 예측값 $\hat y$도 $y$를 특징행렬의 열공간에 직교사영한 것이다.

### 정의
**사영(projection, 정의 3.10):** 부분공간 $U$로 가는 선형사상 $\pi$가 $\pi^2=\pi\circ\pi=\pi$를 만족하면 사영이다. 행렬로는 **$P_\pi^2=P_\pi$** (멱등, idempotent). "이미 $U$에 있는 점은 다시 사영해도 그대로"라는 뜻이다.

**직교사영:** 사영된 점 $\pi_U(x)$가 $x$와 가장 가깝고, 그래서 **오차 $x-\pi_U(x)$가 $U$와 직교**한다.

### 3.8.1 직선(1차원 부분공간)으로의 사영
$U=\text{span}[b]$, 점곱 기준. 3단계로 유도한다.

1. **좌표 구하기:** $\pi_U(x)\in U$이므로 $\pi_U(x)=\lambda b$. 오차 $x-\lambda b$는 $b$와 직교해야 한다:
$$\langle x-\lambda b,\,b\rangle=0\ \Rightarrow\ \langle x,b\rangle-\lambda\langle b,b\rangle=0\ \Rightarrow\ \lambda=\frac{\langle x,b\rangle}{\langle b,b\rangle}=\frac{b^\top x}{\|b\|^2}.$$
2. **사영점:** $\pi_U(x)=\lambda b=\frac{b^\top x}{\|b\|^2}b$. 길이는 $\|\pi_U(x)\|=|\cos\omega|\,\|x\|$ ($\omega$는 $x$와 $b$의 각도). $\|b\|=1$이면 $\lambda=b^\top x$로 더 간단해진다.
3. **사영행렬:** $\pi_U(x)=\lambda b=b\lambda=b\frac{b^\top x}{\|b\|^2}=\frac{bb^\top}{\|b\|^2}x$이므로
$$P_\pi=\frac{bb^\top}{\|b\|^2}.$$
   대칭행렬이고 랭크 1이다.

**손 예제:** $b=[1,2,2]^\top$, $x=[1,1,1]^\top$.
- $b^\top x=1+2+2=5$, $\|b\|^2=1+4+4=9$, $\lambda=\frac59$.
- $\pi_U(x)=\frac59[1,2,2]^\top=[\tfrac59,\tfrac{10}9,\tfrac{10}9]^\top$.
- $P_\pi=\frac19\begin{bmatrix}1&2&2\\2&4&4\\2&4&4\end{bmatrix}$.
- 검산: 오차 $x-\pi_U(x)=[\tfrac49,-\tfrac19,-\tfrac19]^\top$, $b$와 내적 $\tfrac49-\tfrac29-\tfrac29=0$. 직교한다.

### 3.8.2 일반 부분공간으로의 사영
$U=\text{span}[b_1,\dots,b_m]\subseteq\mathbb R^n$, 기저를 열로 모은 $B=[b_1,\dots,b_m]\in\mathbb R^{n\times m}$.

1. **좌표 구하기:** $\pi_U(x)=B\lambda$ ($\lambda\in\mathbb R^m$). 오차가 **모든** 기저벡터와 직교해야 하므로 $b_i^\top(x-B\lambda)=0$ ($i=1..m$). 한꺼번에 쓰면
$$B^\top(x-B\lambda)=0\ \Rightarrow\ \underbrace{B^\top B\lambda=B^\top x}_{\text{정규방정식(normal equation)}}\ \Rightarrow\ \lambda=(B^\top B)^{-1}B^\top x.$$
   $B$의 열이 기저(일차독립)라 $B^\top B$는 역행렬이 있다.
2. **사영점:** $\pi_U(x)=B(B^\top B)^{-1}B^\top x$.
3. **사영행렬:** $$P_\pi=B(B^\top B)^{-1}B^\top.$$

- $m=1$이면 3.8.1의 식과 같아진다.
- $(B^\top B)^{-1}B^\top$은 2.3.4의 **유사역행렬**이다. $\lambda$는 $Bx=$(근사)문제의 **최소제곱해**다. 즉 "풀 수 없는 $B\lambda=x$를 가장 가깝게 푸는 것 = $x$를 $B$의 열공간에 사영하는 것". **9장에서 $B\to X$(데이터), $\lambda\to\theta$, $x\to y$로 바꾸면 정규방정식 $\theta=(X^\top X)^{-1}X^\top y$가 된다.**
- **정규직교기저면** $B^\top B=I$이므로 $\pi_U(x)=BB^\top x$, $\lambda=B^\top x$. 역행렬 계산이 사라진다.
- **일반 내적** $\langle x,y\rangle=x^\top Ay$를 쓰면 직교 조건이 $B^\top A(x-B\lambda)=0$이 되어 $\lambda=(B^\top AB)^{-1}B^\top Ax$ (교재 연습문제 3.6이 이 경우다).

**손 예제:** $U=\text{span}[[1,0,1]^\top,[0,1,1]^\top]$, $x=[2,1,0]^\top$.
- $B=\begin{bmatrix}1&0\\0&1\\1&1\end{bmatrix}$, $B^\top B=\begin{bmatrix}2&1\\1&2\end{bmatrix}$, $B^\top x=[2+0+0,\ 0+1+0]^\top=[2,1]^\top$.
- 정규방정식 $\begin{bmatrix}2&1\\1&2\end{bmatrix}\lambda=\begin{bmatrix}2\\1\end{bmatrix}$. $(B^\top B)^{-1}=\frac13\begin{bmatrix}2&-1\\-1&2\end{bmatrix}$이라 $\lambda=\frac13[4-1,\,-2+2]^\top=[1,0]^\top$.
- $\pi_U(x)=1\cdot[1,0,1]^\top+0\cdot[0,1,1]^\top=[1,0,1]^\top$.
- 오차 $x-\pi_U(x)=[1,1,-1]^\top$. 두 기저벡터와 내적: $1+0-1=0$, $0+1-1=0$. 직교한다. (3.6 예제의 $U^\perp$ 방향과 같다.)
- 거리 $d(x,U)=\|[1,1,-1]^\top\|=\sqrt3$.
- 사영행렬 $P_\pi=\frac13\begin{bmatrix}2&-1&1\\-1&2&1\\1&1&2\end{bmatrix}$, 계산해 보면 $P_\pi^2=P_\pi$.

**교재 예제 3.11**도 같은 방법이다($U=\text{span}[[1,1,1]^\top,[0,1,2]^\top]$, $x=[6,0,0]^\top$ → $\pi_U(x)=[5,2,-1]^\top$). 직접 따라 풀어 보면 좋다.

### 3.8.3 그람-슈미트 직교화 (Gram–Schmidt Orthogonalization)
일차독립인 $b_1,\dots,b_n$으로 같은 공간의 직교기저 $u_1,\dots,u_n$을 만든다. 아이디어: **각 벡터에서 "이미 만든 방향들 위로의 사영"을 빼서 새로운 방향만 남긴다.**
$$u_1:=b_1,\qquad u_k:=b_k-\pi_{\text{span}[u_1,\dots,u_{k-1}]}(b_k)=b_k-\sum_{j=1}^{k-1}\frac{\langle b_k,u_j\rangle}{\langle u_j,u_j\rangle}u_j.$$
마지막에 $c_k=u_k/\|u_k\|$로 정규화하면 정규직교기저. ($u_j$들이 서로 직교하므로 span 위로의 사영이 각 방향 사영의 합으로 쪼개진다.)

**손 예제:** $b_1=[1,1,0]^\top$, $b_2=[1,0,1]^\top$.
- $u_1=b_1=[1,1,0]^\top$, $\|u_1\|^2=2$.
- $\langle b_2,u_1\rangle=1$. $u_2=b_2-\frac12u_1=[1,0,1]^\top-[\tfrac12,\tfrac12,0]^\top=[\tfrac12,-\tfrac12,1]^\top$.
- 검산 $u_1^\top u_2=\tfrac12-\tfrac12+0=0$.
- 정규화: $c_1=\frac1{\sqrt2}[1,1,0]^\top$, $c_2=\frac{u_2}{\|u_2\|}=\frac{1}{\sqrt{3/2}}[\tfrac12,-\tfrac12,1]^\top=\frac1{\sqrt6}[1,-1,2]^\top$.

### 3.8.4 아핀 부분공간으로의 사영
$L=x_0+U$(2.8)로 사영하려면 **평행이동해서 부분공간 문제로 바꾸고, 다시 되돌린다:**
$$\pi_L(x)=x_0+\pi_U(x-x_0),\qquad d(x,L)=d(x-x_0,\,U).$$
**손 예제:** 직선 $L=[1,0]^\top+\text{span}[[1,1]^\top]$, $x=[2,3]^\top$.
- $x-x_0=[1,3]^\top$. $U=\text{span}[[1,1]^\top]$로 사영: $\lambda=\frac{1+3}{2}=2$, $\pi_U=[2,2]^\top$.
- $\pi_L(x)=[1,0]^\top+[2,2]^\top=[3,2]^\top$.
- $d(x,L)=\|[2,3]-[3,2]\|=\|[-1,1]\|=\sqrt2$.
교재는 이것으로 12.1절의 분리 초평면을 유도한다고 예고한다(점과 초평면 사이 거리 = 마진).

### 헷갈리는 점
- 사영행렬 $P=B(B^\top B)^{-1}B^\top$에서 $(B^\top B)^{-1}$을 $B^{-1}(B^\top)^{-1}$로 쪼개면 안 된다. $B$는 보통 정사각이 아니라 역행렬이 없다. (정사각이고 가역이면 $P=I$가 되어 의미가 없다. 공간 전체로의 사영이기 때문이다.)
- 점곱으로 구한 직교사영의 행렬은 대칭이다($P^\top=P$). 멱등($P^2=P$)이면서 대칭이면 직교사영이다(교재 밖 보충: 멱등이기만 하면 비스듬한 사영일 수도 있다).
- $I-P$는 $U^\perp$로의 사영이다(교재 연습문제 3.7과 연결).

---

## 3.9 회전 (Rotations, 91쪽)

### 정의와 성질
- **2차원 회전:** 원점을 중심으로 반시계 방향 $\theta$만큼 돌리는 행렬
$$R(\theta)=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}.$$
  유도: $e_1=[1,0]^\top$은 $[\cos\theta,\sin\theta]^\top$로, $e_2=[0,1]^\top$은 $[-\sin\theta,\cos\theta]^\top$로 간다. 이 둘을 열로 쓰면 된다(2.7.1의 "변환행렬의 $j$열 = 기저벡터의 상").
- **3차원 회전:** 축 하나를 고정하고 나머지 평면에서 2차원 회전. 예: $e_1$축 회전은 $\begin{bmatrix}1&0&0\\0&\cos\theta&-\sin\theta\\0&\sin\theta&\cos\theta\end{bmatrix}$. 회전 방향은 축을 마주 보고(축 끝에서 원점을 볼 때) 반시계다.
- **$n$차원 회전(기븐스 회전, Givens rotation, 정의 3.11):** 두 좌표 $i,j$의 평면에서만 2차원 회전을 하고 나머지 좌표는 그대로 두는 행렬.
- **성질(3.9.4):** 회전행렬은 직교행렬이라
  - 거리를 보존한다: $\|x-y\|=\|R_\theta x-R_\theta y\|$.
  - 각도를 보존한다.
  - **3차원 이상에서는 일반적으로 교환되지 않는다**(순서가 중요). 2차원에서만 $R(\phi)R(\theta)=R(\theta)R(\phi)$이고, 같은 점을 중심으로 한 2차원 회전들은 곱셈에 대해 아벨군을 이룬다.

### 손으로 풀어 보는 예제 (교재 연습문제 3.10)
$30^\circ$ 회전: $\cos30^\circ=\frac{\sqrt3}2$, $\sin30^\circ=\frac12$.
- $x_1=[2,3]^\top$: $R x_1=\left[\tfrac{\sqrt3}2\cdot2-\tfrac12\cdot3,\ \tfrac12\cdot2+\tfrac{\sqrt3}2\cdot3\right]^\top=\left[\sqrt3-\tfrac32,\ 1+\tfrac{3\sqrt3}2\right]^\top\approx[0.23,\,3.60]^\top$.
- $x_2=[0,-1]^\top$: $Rx_2=\left[\tfrac12,\ -\tfrac{\sqrt3}2\right]^\top$.
- 검산: 길이 보존. $\|x_1\|^2=13$, $(0.232)^2+(3.598)^2\approx0.054+12.946=13.0$.

---

## 핵심 유도 모음 (백지에 쓸 수 있어야 하는 것)

**1. 직선으로의 사영** (3.8.1의 3단계)
- $\pi=\lambda b$ (사영점은 $U$ 위에 있다)
- $b^\top(x-\lambda b)=0$ (오차는 $U$와 직교해야 가장 가깝다)
- $\lambda=\frac{b^\top x}{b^\top b}$, $P=\frac{bb^\top}{b^\top b}$

**2. 일반 부분공간으로의 사영** (3.8.2)
- $\pi=B\lambda$
- $B^\top(x-B\lambda)=0$ (오차가 모든 기저벡터와 직교)
- $B^\top B\lambda=B^\top x$ (정규방정식) → $\lambda=(B^\top B)^{-1}B^\top x$
- $P=B(B^\top B)^{-1}B^\top$

**3. 사영행렬이 멱등이고 대칭임**
- $P^2=B(B^\top B)^{-1}\underbrace{B^\top B(B^\top B)^{-1}}_{=I}B^\top=B(B^\top B)^{-1}B^\top=P$
- $P^\top=B\big((B^\top B)^{-1}\big)^\top B^\top=B(B^\top B)^{-1}B^\top=P$ ($B^\top B$가 대칭이라 그 역행렬도 대칭)

**4. 직교사영이 가장 가까운 점인 이유** (교재 밖 보충, 피타고라스)
- $U$ 안의 아무 점 $u$에 대해 $x-u=(x-\pi_U(x))+(\pi_U(x)-u)$. 첫째 항은 $U^\perp$, 둘째 항은 $U$에 있어 직교.
- $\|x-u\|^2=\|x-\pi_U(x)\|^2+\|\pi_U(x)-u\|^2\ge\|x-\pi_U(x)\|^2$. 등호는 $u=\pi_U(x)$일 때.

**5. 직교행렬은 길이·각도를 보존**
- $\|Ax\|^2=x^\top A^\top Ax=x^\top x$, 내적도 $(Ax)^\top(Ay)=x^\top y$.

**6. 그람-슈미트 한 단계가 직교를 만드는 이유**
- $u_2=b_2-\frac{\langle b_2,u_1\rangle}{\langle u_1,u_1\rangle}u_1$에 $u_1$을 내적하면 $\langle b_2,u_1\rangle-\frac{\langle b_2,u_1\rangle}{\langle u_1,u_1\rangle}\langle u_1,u_1\rangle=0$.

**7. 2차원 회전행렬 유도**
- $e_1\mapsto[\cos\theta,\sin\theta]^\top$, $e_2\mapsto[-\sin\theta,\cos\theta]^\top$ (단위원 위의 점), 이를 열로 쌓는다.

---

## 말로 설명하기 (개념 서술형·구술 대비)

서술형 문항이나 구술 질문에 대비해 말로도 설명해 본다.

**Q. 내적의 조건은 무엇이고, 행렬로는 어떻게 표현되나요?**
"쌍선형이고 대칭이며 양의 정부호인 함수입니다. 유한차원에서는 기저를 정하면 $\langle x,y\rangle=\hat x^\top A\hat y$로 쓸 수 있고, 이때 $A$가 대칭 양의 정부호 행렬이어야 합니다. 그래서 내적을 고르는 것은 SPD 행렬을 고르는 것과 같습니다. 점곱은 $A=I$인 경우입니다."

**Q. 양의 정부호 행렬이란? 어떻게 판정하나요?**
"0이 아닌 모든 $x$에 대해 $x^\top Ax>0$인 대칭행렬입니다. 모든 고유값이 양수인 것과 같고, 2×2라면 $a_{11}>0$이고 행렬식이 양수인 것으로 판정할 수 있습니다. 역행렬이 있고 대각 원소가 양수라는 성질이 따라옵니다. 공분산 행렬은 양의 준정부호입니다."

**Q. 직교사영을 유도해 보세요.**
"사영점은 부분공간 위에 있으니 $B\lambda$로 씁니다. 가장 가까운 점이 되려면 오차 $x-B\lambda$가 부분공간과 직교해야 하므로 $B^\top(x-B\lambda)=0$입니다. 이것을 정리한 정규방정식 $B^\top B\lambda=B^\top x$에서 $\lambda=(B^\top B)^{-1}B^\top x$를 얻고, 사영행렬은 $B(B^\top B)^{-1}B^\top$입니다. 선형회귀의 정규방정식과 같은 식입니다."

**Q. 사영행렬의 성질은?**
"멱등($P^2=P$)이라 한 번 사영한 점은 다시 사영해도 그대로이고, 점곱 기준 직교사영이면 대칭입니다. 랭크는 부분공간의 차원과 같고, $I-P$는 직교여공간으로의 사영입니다."

**Q. 정규직교기저가 왜 편한가요?**
"좌표를 내적 한 번으로 구할 수 있고($\lambda_j=\langle x,b_j\rangle$), 사영 공식의 $B^\top B$가 $I$가 되어 $BB^\top x$로 단순해집니다. 대칭행렬의 고유벡터, SVD의 특이벡터, PCA 주성분이 모두 정규직교기저입니다."

**Q. 그람-슈미트 과정을 설명해 보세요.**
"벡터를 하나씩 보면서, 앞에서 만든 직교 방향들 위로의 사영을 빼 새 방향만 남깁니다. 그러면 남은 벡터는 앞의 벡터들과 직교하고, 마지막에 길이로 나누면 정규직교기저가 됩니다."

**Q. 코사인 유사도는 무엇을 재나요?**
"두 벡터 사이 각도의 코사인, 즉 $\frac{\langle x,y\rangle}{\|x\|\|y\|}$로 길이와 무관하게 방향만 비교합니다. CLIP은 이미지와 문장 임베딩을 이 값으로 비교합니다."

---

## 연습문제

### 확인 문제 (풀이 포함)

**문제 1.** $x=[1,-2,2]^\top$의 $\ell_1$, $\ell_2$ 노름은?
> **풀이:** $\ell_1=1+2+2=5$, $\ell_2=\sqrt{1+4+4}=3$.

**문제 2.** $\langle x,y\rangle=x^\top\begin{bmatrix}4&2\\2&3\end{bmatrix}y$는 내적인가?
> **풀이:** 대칭이다. $a_{11}=4>0$, 행렬식 $12-4=8>0$이라 SPD. 그러므로 내적이다.

**문제 3.** 점곱에서 $x=[1,2,3]^\top$과 $y=[2,-1,0]^\top$의 각도는?
> **풀이:** $x^\top y=2-2+0=0$. 직교, $90^\circ$.

**문제 4.** 문제 3의 두 벡터가 $\langle x,y\rangle=x^\top\text{diag}(1,2,1)\,y$에서도 직교인가?
> **풀이:** $1\cdot1\cdot2+2\cdot2\cdot(-1)+1\cdot3\cdot0=2-4=-2\ne0$. 직교가 아니다. 직교는 내적에 따라 달라진다.

**문제 5.** $Q=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$이 직교행렬임을 보이고 $\|Q[3,4]^\top\|$를 계산 없이 말하라.
> **풀이:** $Q^\top Q=\frac12\begin{bmatrix}2&0\\0&2\end{bmatrix}=I$. 직교행렬은 길이를 보존하므로 $\|Q[3,4]^\top\|=5$.

**문제 6.** $b=[2,1]^\top$이 생성하는 직선으로 $x=[1,3]^\top$을 사영하고, 사영행렬을 구하라.
> **풀이:** $\lambda=\frac{2+3}{5}=1$, $\pi=[2,1]^\top$. $P=\frac15\begin{bmatrix}4&2\\2&1\end{bmatrix}$. 검산: 오차 $[-1,2]^\top$와 $b$의 내적 $-2+2=0$.

**문제 7.** $U=\text{span}[[1,1,0]^\top,[0,0,1]^\top]$로 $x=[1,3,5]^\top$을 사영하라.
> **풀이:** 두 기저벡터가 이미 직교한다. 각 방향 사영을 더하면 된다: $\frac{1+3}{2}[1,1,0]^\top+\frac51[0,0,1]^\top=[2,2,5]^\top$. 오차 $[-1,1,0]^\top$는 두 벡터와 직교한다.

**문제 8.** $b_1=[1,0,1]^\top$, $b_2=[1,1,1]^\top$을 그람-슈미트로 정규직교화하라.
> **풀이:** $u_1=b_1$, $\|u_1\|^2=2$, $\langle b_2,u_1\rangle=2$. $u_2=b_2-u_1=[0,1,0]^\top$. $c_1=\frac1{\sqrt2}[1,0,1]^\top$, $c_2=[0,1,0]^\top$.

**문제 9.** 평면 $U=\{x\in\mathbb R^3:x_1+x_2+x_3=0\}$의 직교여공간과, $x=[1,2,3]^\top$에서 $U$까지의 거리를 구하라.
> **풀이:** $U^\perp=\text{span}[n]$, $n=[1,1,1]^\top$(법선벡터). $x$의 $U^\perp$ 성분 $=\frac{n^\top x}{\|n\|^2}n=\frac63[1,1,1]^\top=[2,2,2]^\top$. 이것이 $x$에서 $U$까지의 오차 벡터라 거리 $=\|[2,2,2]^\top\|=2\sqrt3$. ($\pi_U(x)=x-[2,2,2]^\top=[-1,0,1]^\top$, 성분 합 0으로 $U$ 위에 있다.)

**문제 10.** 사영행렬 $P$에 대해 $I-P$도 사영임을 보여라.
> **풀이:** $(I-P)^2=I-2P+P^2=I-2P+P=I-P$.

**문제 11.** $R(90^\circ)$로 $[1,0]^\top$을 회전하면? $R(90^\circ)R(90^\circ)$는?
> **풀이:** $R(90^\circ)=\begin{bmatrix}0&-1\\1&0\end{bmatrix}$, $[1,0]^\top\mapsto[0,1]^\top$. $R(90^\circ)^2=\begin{bmatrix}-1&0\\0&-1\end{bmatrix}=R(180^\circ)$.

### 교재 연습문제 안내 (96~97쪽, 답은 sympy로 검산)

| 번호 | 무엇을 묻나 | 답 / 풀이 방향 |
|---|---|---|
| 3.1 | $x_1y_1-(x_1y_2+x_2y_1)+2x_2y_2$가 내적인가 | $x^\top\begin{bmatrix}1&-1\\-1&2\end{bmatrix}y$. 대칭이고, $x^\top Ax=x_1^2-2x_1x_2+2x_2^2=(x_1-x_2)^2+x_2^2>0$ ($x\ne0$)이라 내적이다 |
| 3.2 | $x^\top\begin{bmatrix}2&0\\1&2\end{bmatrix}y$가 내적인가 | 대칭이 아니라 **아니다** ($\langle e_1,e_2\rangle=0\ne\langle e_2,e_1\rangle=1$) |
| 3.3 | 두 내적에서 거리 | (a) $\sqrt{22}$ (b) $\sqrt{47}$ (위 3.3 예제) |
| 3.4 | 두 내적에서 각도 | (a) $\arccos(-3/\sqrt{10})\approx2.82$ rad (b) $\arccos(-11/\sqrt{126})\approx2.94$ rad (위 3.4 예제) |
| 3.5 | $\mathbb R^5$의 부분공간 사영과 거리 | 생성 벡터 4개 중 독립인 것은 3개(랭크 3)라 먼저 기저를 고른다. $\pi_U(x)=[1,-5,-1,-2,3]^\top$, $d(x,U)=\|x-\pi_U(x)\|=2\sqrt{15}$ |
| 3.6 | 일반 내적에서 $e_2$를 $\text{span}[e_1,e_3]$에 사영 | 직교 조건이 $B^\top A(x-B\lambda)=0$. $\pi_U(e_2)=[\tfrac12,0,-\tfrac12]^\top$, 거리 1. 점곱이면 사영이 0인데 내적이 바뀌어 달라진다 |
| 3.7 | $\pi$가 사영 ⇔ $\text{id}-\pi$가 사영, 핵·상 관계 | $(\text{id}-\pi)^2=\text{id}-2\pi+\pi^2$. $\text{Im}(\text{id}-\pi)=\ker\pi$, $\ker(\text{id}-\pi)=\text{Im}\,\pi$ |
| 3.8 | 그람-슈미트 | $c_1=\frac1{\sqrt3}[1,1,1]^\top$, $u_2=b_2-\frac{1}{3}[1,1,1]^\top=[-\tfrac43,\tfrac53,-\tfrac13]^\top$, $c_2=\frac1{\sqrt{42}}[-4,5,-1]^\top$ |
| 3.9 | 코시-슈바르츠 응용 | (a) $x=(x_i)$, $y=(1,\dots,1)$: $1=(\sum x_i)^2\le n\sum x_i^2$ → $\sum x_i^2\ge\frac1n$. (b) $u=(\sqrt{x_i})$, $v=(1/\sqrt{x_i})$: $n^2=(\sum1)^2\le(\sum x_i)(\sum\frac1{x_i})$ → $\sum\frac1{x_i}\ge n^2$ |
| 3.10 | $30^\circ$ 회전 | $[\sqrt3-\tfrac32,\ 1+\tfrac{3\sqrt3}2]^\top$, $[\tfrac12,-\tfrac{\sqrt3}2]^\top$ (위 3.9 예제) |

---

## 시험 직전 10분 요약

**노름:** 절대동차·삼각부등식·양의 정부호. $\|x\|_1=\sum|x_i|$, $\|x\|_2=\sqrt{x^\top x}$.

**내적:** 쌍선형 + 대칭 + 양의 정부호. 유한차원에서 $\langle x,y\rangle=\hat x^\top A\hat y$, $A$는 **SPD**. SPD ⇔ $x^\top Ax>0$ ($x\ne0$) ⇔ 고유값 모두 양수. 2×2는 $a>0$, $ac-b^2>0$.

**길이·거리·각도:** $\|x\|=\sqrt{\langle x,x\rangle}$, $d(x,y)=\|x-y\|$, $\cos\omega=\frac{\langle x,y\rangle}{\|x\|\|y\|}$. 코시-슈바르츠 $|\langle x,y\rangle|\le\|x\|\|y\|$. 직교 = 내적 0 (내적마다 다름).

**직교행렬:** $A^\top A=I$ ⇔ 열이 정규직교 ⇔ $A^{-1}=A^\top$. 길이·각도 보존.

**직교여공간:** $\dim U^\perp=D-\dim U$, $U\cap U^\perp=\{0\}$, $U^\perp=\ker B^\top$. 법선벡터.

**사영 (가장 중요):**
- 직선: $\pi=\frac{b^\top x}{b^\top b}b$, $P=\frac{bb^\top}{b^\top b}$
- 부분공간: $B^\top B\lambda=B^\top x$, $\pi=B(B^\top B)^{-1}B^\top x$, $P=B(B^\top B)^{-1}B^\top$
- ONB면 $P=BB^\top$. 일반 내적 $A$면 $\lambda=(B^\top AB)^{-1}B^\top Ax$
- $P^2=P$, $P^\top=P$, $I-P$는 $U^\perp$로의 사영
- 아핀: $\pi_L(x)=x_0+\pi_U(x-x_0)$

**그람-슈미트:** $u_k=b_k-\sum_{j<k}\frac{\langle b_k,u_j\rangle}{\langle u_j,u_j\rangle}u_j$, 마지막에 정규화.

**회전:** $R(\theta)=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$. 직교행렬이라 거리·각도 보존. 2차원만 교환, 3차원 이상은 순서 중요.
