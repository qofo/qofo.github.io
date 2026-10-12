---
title: "MML 4장 행렬분해: 고유값, 대각화, SVD"
slug: "mml-ch04-matrix-decompositions"
date: 2026-10-12
weight: 4
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "행렬분해", "고유값", "SVD", "숄레스키 분해"]
description: "MML 4장(교재 98~138쪽) 해설. 행렬식과 대각합, 고유값과 고유벡터, 숄레스키 분해, 대각화, 특이값 분해(SVD), 저계수 근사를 손계산과 연습문제 4.1~4.12 풀이로 정리했다."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재 98~138쪽.** 행렬 하나를 "더 단순한 행렬들의 곱"으로 쪼개는 방법들이다. 행렬식과 고유값은 6장(가우시안의 정규화 상수 $\det\Sigma$, 공분산의 고유벡터)에, 숄레스키 분해는 6장(가우시안 표본 뽑기)에, **고유분해와 SVD는 10장 PCA의 핵심**이고, Eckart–Young 정리(저계수 근사)는 10장의 배경이다.

---

## 0. 이 장 지도

**흐름:** 정사각행렬을 숫자 하나로 요약하는 행렬식·대각합(4.1) → 방향이 안 바뀌는 특별한 벡터인 고유벡터(4.2) → SPD 행렬의 "제곱근" 숄레스키(4.3) → 고유벡터로 대각행렬 만들기(4.4) → 모든 행렬에 되는 SVD(4.5) → SVD로 행렬을 근사하기(4.6) → 분해들 사이의 관계(4.7)

| 절 | 핵심 한 줄 | 중요도 | 뒤에서 쓰이는 곳 |
|---|---|---|---|
| 4.1 행렬식과 대각합 | $\det A\ne0\iff$ 가역, 부피 배율. $\text{tr}(AB)=\text{tr}(BA)$ | ★★★ | 5장 행렬미분, 6장 가우시안 |
| 4.2 고유값·고유벡터 | $Ax=\lambda x$, $\det(A-\lambda I)=0$, 스펙트럼 정리 | ★★★ | 10장 PCA, 6장 공분산 |
| 4.3 숄레스키 분해 | SPD $A=LL^\top$ | ★★ | 6장 표본 추출, 수치 계산 |
| 4.4 고유분해·대각화 | $A=PDP^{-1}$, 대칭이면 $A=QDQ^\top$ | ★★★ | 10장 PCA |
| 4.5 SVD | $A=U\Sigma V^\top$, 모든 행렬 | ★★★ | 10장 PCA, 추천 시스템 |
| 4.6 행렬 근사 | $A_{(k)}=\sum_{i\le k}\sigma_iu_iv_i^\top$, Eckart–Young | ★★★ | 10장, 저계수 근사 |
| 4.7 행렬 계통도 | 분해들 사이의 포함 관계 | ★ | 정리용 |

---

## 4.1 행렬식과 대각합 (Determinant and Trace, 99쪽)

### 왜 필요한가
정사각행렬 하나에 숫자 하나를 붙여 "역행렬이 있는가", "공간을 얼마나 늘리거나 줄이는가"를 바로 알 수 있다. 그리고 고유값을 구하는 특성다항식이 행렬식으로 정의된다.

### 행렬식 (Determinant)
**정리 4.1:** $A$가 가역 $\iff\det(A)\ne0$.

**작은 행렬 공식:**
- $1\times1$: $\det(a_{11})=a_{11}$
- $2\times2$: $\det\begin{bmatrix}a_{11}&a_{12}\\a_{21}&a_{22}\end{bmatrix}=a_{11}a_{22}-a_{12}a_{21}$
- $3\times3$ **사루스 규칙(Sarrus' rule):** 오른쪽 아래로 가는 대각선 세 개의 곱을 더하고, 왼쪽 아래로 가는 대각선 세 개의 곱을 뺀다.
$$\det A=a_{11}a_{22}a_{33}+a_{21}a_{32}a_{13}+a_{31}a_{12}a_{23}-a_{31}a_{22}a_{13}-a_{11}a_{32}a_{23}-a_{21}a_{12}a_{33}$$
- **삼각행렬:** 대각 원소의 곱.

**기하학적 의미:** $\det A$의 절댓값은 $A$의 열벡터들이 만드는 평행사변형(2차원)·평행육면체(3차원)의 넓이·부피다. 부호는 방향(오른손/왼손)을 나타낸다. 열이 일차종속이면 납작해져 부피가 0이다. 그래서 $\det=0\iff$ 가역이 아님.

**라플라스 전개(Laplace expansion, 정리 4.2):** $j$열(또는 $j$행)을 따라
$$\det A=\sum_{k=1}^n(-1)^{k+j}a_{kj}\det(A_{k,j}),$$
여기서 $A_{k,j}$는 $k$행과 $j$열을 지운 $(n-1)\times(n-1)$ 행렬(소행렬, minor)이고, $(-1)^{k+j}\det(A_{k,j})$를 여인수(cofactor)라 한다. 부호는 체스판 무늬 $\begin{bmatrix}+&-&+\\-&+&-\\+&-&+\end{bmatrix}$로 기억한다. 0이 많은 행이나 열을 골라 전개하면 계산이 줄어든다.

**성질 (교재 정리, 암기):**
1. $\det(AB)=\det(A)\det(B)$
2. $\det(A^\top)=\det(A)$
3. $\det(A^{-1})=\frac{1}{\det A}$
4. 닮은 행렬은 행렬식이 같다(그래서 선형사상의 행렬식은 기저와 무관하다).
5. 한 행(열)에 다른 행(열)의 배수를 더해도 $\det$는 그대로다.
6. 한 행(열)에 $\lambda$를 곱하면 $\det$도 $\lambda$배. 특히 $\det(\lambda A)=\lambda^n\det A$.
7. 두 행(열)을 바꾸면 부호가 바뀐다.

5~7 덕분에 **가우스 소거로 삼각행렬을 만든 뒤 대각을 곱해** 행렬식을 구할 수 있다(행 교환 횟수만큼 부호를 바꾼다).

**정리 4.3:** $\det A\ne0\iff\text{rk}(A)=n$ (2장의 랭크와 연결).

### 대각합 (Trace)
**정의 4.4:** $\text{tr}(A)=\sum_ia_{ii}$ (대각 원소의 합).

**성질:**
- $\text{tr}(A+B)=\text{tr}A+\text{tr}B$, $\text{tr}(\alpha A)=\alpha\,\text{tr}A$, $\text{tr}(I_n)=n$
- $\text{tr}(AB)=\text{tr}(BA)$ ($A\in\mathbb R^{n\times k}$, $B\in\mathbb R^{k\times n}$, 크기가 달라도 된다)
- **순환 불변(cyclic):** $\text{tr}(AKL)=\text{tr}(KLA)=\text{tr}(LAK)$. 순서를 "돌리는" 것만 되고 아무렇게나 바꾸면 안 된다.
- 특수한 경우: $\text{tr}(xy^\top)=y^\top x$ (벡터 외적의 대각합 = 내적). 6장·10장에서 기댓값 계산에 자주 쓴다.
- 닮은 행렬의 대각합은 같다: $\text{tr}(S^{-1}AS)=\text{tr}(ASS^{-1})=\text{tr}(A)$. 그래서 선형사상의 대각합도 기저와 무관하다.

### 특성다항식 (Characteristic Polynomial, 정의 4.5)
$$\begin{aligned} p_A(\lambda) &= \det(A-\lambda I) \\ &= c_0+c_1\lambda+\cdots \\ &\quad + c_{n-1}\lambda^{n-1}+(-1)^n\lambda^n, \end{aligned}$$
여기서 $c_0=\det A$, $c_{n-1}=(-1)^{n-1}\text{tr}(A)$. $2\times2$이면 $p_A(\lambda)=\lambda^2-\text{tr}(A)\lambda+\det(A)$.

### 손으로 풀어 보는 예제
**(1) 사루스:** $A=\begin{bmatrix}2&1&0\\1&3&1\\0&1&2\end{bmatrix}$.
- 더하는 항: $2\cdot3\cdot2+1\cdot1\cdot0+0\cdot1\cdot1=12$
- 빼는 항: $0\cdot3\cdot0+2\cdot1\cdot1+1\cdot1\cdot2=0+2+2=4$
- $\det A=12-4=8$.

**(2) 라플라스(1행 전개):** 같은 $A$.
$$\begin{aligned} \det A &= 2\det\begin{bmatrix}3&1\\1&2\end{bmatrix} \\ &\quad - 1\det\begin{bmatrix}1&1\\0&2\end{bmatrix}+0 \\ &= 2(6-1)-1(2-0) \\ &= 10-2=8. \end{aligned}$$

**(3) 교재 연습문제 4.1:** $A=\begin{bmatrix}1&3&5\\2&4&6\\0&2&4\end{bmatrix}$.
- 라플라스(1행): $1(16-12)-3(8-0)+5(4-0)=4-24+20=0$.
- 사루스: $1\cdot4\cdot4+2\cdot2\cdot5+0\cdot3\cdot6-0\cdot4\cdot5-1\cdot2\cdot6-2\cdot3\cdot4=16+20+0-0-12-24=0$.
- 행렬식 0 → 가역이 아니다. 실제로 행 사이에 종속 관계가 있다: $R_2+R_3=[2,6,10]=2R_1$.

### 헷갈리는 점
- $\det(A+B)\ne\det A+\det B$. 합에는 성질이 없다.
- $\det(\lambda A)=\lambda^n\det A$이지 $\lambda\det A$가 아니다.
- 사루스 규칙은 **$3\times3$에서만** 쓴다. $4\times4$ 이상은 라플라스 전개나 가우스 소거를 쓴다.

---

## 4.2 고유값과 고유벡터 (Eigenvalues and Eigenvectors, 105쪽)

### 왜 필요한가
대부분의 벡터는 행렬을 곱하면 방향이 바뀐다. 그런데 어떤 특별한 방향은 **늘어나거나 줄어들기만 하고 방향은 그대로**다. 이 방향(고유벡터)과 늘어나는 배율(고유값)을 알면 행렬의 작용을 완전히 이해할 수 있다. PCA의 주성분은 공분산 행렬의 고유벡터다.

### 정의와 성질
**정의 4.6:** 정사각행렬 $A$에 대해
$$Ax=\lambda x,\qquad x\ne0$$
이면 $\lambda$를 고유값(eigenvalue), $x$를 고유벡터(eigenvector)라 한다. ($x=0$은 항상 만족하니 제외한다.)

**구하는 방법 (정리 4.8):** $Ax=\lambda x\iff(A-\lambda I)x=0$이 $0$이 아닌 해를 가짐 $\iff A-\lambda I$가 가역이 아님 $\iff\det(A-\lambda I)=0$. 그래서
1. 특성방정식 $\det(A-\lambda I)=0$을 풀어 고유값 $\lambda$를 구한다.
2. 각 $\lambda$마다 $(A-\lambda I)x=0$의 영공간(2장)을 구하면 그것이 고유벡터들이다.

**용어:**
- **고유공간(eigenspace) $E_\lambda$:** $\lambda$에 대한 고유벡터 전체 + 영벡터 = $\ker(A-\lambda I)$. 부분공간이다.
- **고유스펙트럼(eigenspectrum):** 고유값 전체의 집합.
- **대수적 중복도(algebraic multiplicity):** 특성다항식에서 그 근이 몇 번 겹치는가.
- **기하적 중복도(geometric multiplicity):** 그 고유공간의 차원(독립인 고유벡터 수). 항상 $1\le$ 기하적 $\le$ 대수적.
- 고유벡터는 크기를 바꿔도(0이 아닌 상수배) 고유벡터다. 그래서 보통 길이 1로 정규화한다. 교재는 같은/반대 방향 벡터를 공선(collinear)이라 부른다.

**성질 (교재 정리):**
- $A$와 $A^\top$은 고유값이 같다(고유벡터는 일반적으로 다르다).
- 닮은 행렬은 고유값이 같다. 그래서 고유값은 선형사상 자체의 성질이다(행렬식, 대각합도 마찬가지).
- 대칭 양의 정부호 행렬의 고유값은 모두 양의 실수다.
- **정리 4.12:** 서로 **다른** 고유값 $n$개에 대응하는 고유벡터들은 일차독립이다.
- **결손(defective) 행렬(정의 4.13):** 일차독립인 고유벡터가 $n$개보다 적은 행렬. 대각화가 안 된다.
- **정리 4.16:** $\det(A)=\prod_i\lambda_i$ (고유값의 곱, 중복 포함).
- **정리 4.17:** $\text{tr}(A)=\sum_i\lambda_i$ (고유값의 합).

**정리 4.14:** 아무 $A\in\mathbb R^{m\times n}$에 대해 $S=A^\top A$는 **대칭 양의 준정부호**다. ($x^\top A^\top Ax=\|Ax\|^2\ge0$.) $\text{rk}(A)=n$이면 양의 정부호다. → SVD(4.5)와 PCA의 출발점.

**정리 4.15 (스펙트럼 정리, Spectral Theorem):** $A$가 **대칭**이면 $A$의 고유벡터로 이루어진 **정규직교기저**가 존재하고, 고유값은 모두 **실수**다. → 대칭행렬은 항상 $A=QDQ^\top$로 대각화된다(4.4).

### 손으로 풀어 보는 예제
**(1) 비대칭 행렬:** $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$.
- 특성다항식: $\det\begin{bmatrix}4-\lambda&1\\2&3-\lambda\end{bmatrix}=(4-\lambda)(3-\lambda)-2=\lambda^2-7\lambda+10=(\lambda-5)(\lambda-2)$.
  (공식으로: $\text{tr}A=7$, $\det A=10$ → $\lambda^2-7\lambda+10$.)
- $\lambda=5$: $A-5I=\begin{bmatrix}-1&1\\2&-2\end{bmatrix}$ → $-x_1+x_2=0$ → $E_5=\text{span}[[1,1]^\top]$.
- $\lambda=2$: $A-2I=\begin{bmatrix}2&1\\2&1\end{bmatrix}$ → $2x_1+x_2=0$ → $E_2=\text{span}[[1,-2]^\top]$.
- 검산: $A[1,1]^\top=[5,5]^\top=5[1,1]^\top$. $A[1,-2]^\top=[2,-4]^\top=2[1,-2]^\top$. $5\cdot2=10=\det A$, $5+2=7=\text{tr}A$.
- 두 고유벡터는 직교하지 않는다($1-2=-1$). 대칭행렬이 아니기 때문이다.

**(2) 대칭 행렬:** $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}$.
- $\lambda^2-4\lambda+3=(\lambda-3)(\lambda-1)$ → $\lambda=3,1$.
- $E_3=\text{span}[[1,1]^\top]$, $E_1=\text{span}[[1,-1]^\top]$. 서로 **직교**한다(스펙트럼 정리).

**(3) 결손 행렬:** $A=\begin{bmatrix}3&1\\0&3\end{bmatrix}$.
- $(\lambda-3)^2=0$ → $\lambda=3$, 대수적 중복도 2.
- $A-3I=\begin{bmatrix}0&1\\0&0\end{bmatrix}$ → $x_2=0$ → $E_3=\text{span}[[1,0]^\top]$, 기하적 중복도 1.
- 독립인 고유벡터가 1개뿐 → **대각화 불가**.

### 헷갈리는 점
- 고유값이 같아도(중복) 고유벡터가 여러 개일 수 있다($I$는 고유값 1 하나에 모든 벡터가 고유벡터). 중복 여부는 기하적 중복도로 따진다.
- 실수 행렬도 고유값이 복소수일 수 있다(예: 회전행렬). 교재는 실수 범위에서 다룬다.
- 고유벡터 계산 결과는 상수배만큼 다를 수 있다. 정답과 방향만 같으면 된다.

---

## 4.3 숄레스키 분해 (Cholesky Decomposition, 114쪽)

### 정의
**정리 4.18:** 대칭 양의 정부호 행렬 $A$는
$$A=LL^\top$$
로 분해된다. $L$은 대각 원소가 양수인 **하삼각행렬**이고, 이런 $L$은 유일하다. 양수 $a$의 제곱근 $\sqrt a$를 행렬로 일반화한 것이라고 생각하면 된다.

### 계산법 (2×2, 3×3)
$\begin{bmatrix}a_{11}&a_{21}\\a_{21}&a_{22}\end{bmatrix}=\begin{bmatrix}l_{11}&0\\l_{21}&l_{22}\end{bmatrix}\begin{bmatrix}l_{11}&l_{21}\\0&l_{22}\end{bmatrix}=\begin{bmatrix}l_{11}^2&l_{11}l_{21}\\l_{11}l_{21}&l_{21}^2+l_{22}^2\end{bmatrix}$에서 원소를 비교해 위에서부터 푼다:
$l_{11}=\sqrt{a_{11}}$, $l_{21}=a_{21}/l_{11}$, $l_{22}=\sqrt{a_{22}-l_{21}^2}$. $3\times3$도 같은 방식(교재 예제 4.10에 일반식).

**손 예제:** $A=\begin{bmatrix}4&2\\2&3\end{bmatrix}$.
- $l_{11}=\sqrt4=2$, $l_{21}=2/2=1$, $l_{22}=\sqrt{3-1}=\sqrt2$.
- $L=\begin{bmatrix}2&0\\1&\sqrt2\end{bmatrix}$. 검산 $LL^\top=\begin{bmatrix}4&2\\2&1+2\end{bmatrix}=A$.

### 어디에 쓰나
- 6장에서 다변수 가우시안 $\mathcal N(\mu,\Sigma)$의 표본을 뽑을 때: $z\sim\mathcal N(0,I)$를 뽑아 $x=\mu+Lz$ ($\Sigma=LL^\top$).
- 행렬식 계산: $\det A=\det L\det L^\top=\prod_il_{ii}^2$.
- 딥러닝의 자동미분에서 공분산 행렬 연산을 안정적으로 할 때.

---

## 4.4 고유분해와 대각화 (Eigendecomposition and Diagonalization, 115쪽)

### 정의
- **대각화 가능(diagonalizable, 정의 4.19):** $D=P^{-1}AP$가 대각행렬이 되는 가역행렬 $P$가 있다. 즉 $A$가 대각행렬과 **닮음**(2.7.2)이다.
- **정리 4.20 (고유분해):** $A\in\mathbb R^{n\times n}$은
$$A=PDP^{-1}$$
  ($P$의 열 = 고유벡터, $D$의 대각 = 대응하는 고유값)으로 쓸 수 있는 것과 **$A$의 고유벡터가 $\mathbb R^n$의 기저를 이루는 것($n$개가 일차독립)**\ 이 같은 말이다. 그래서 결손 행렬은 대각화되지 않는다.
- **왜 $AP=PD$인가:** $AP=[Ap_1,\dots,Ap_n]=[\lambda_1p_1,\dots,\lambda_np_n]=PD$. 양변 오른쪽에 $P^{-1}$을 곱하면 $A=PDP^{-1}$.
- **정리 4.21:** 대칭행렬은 항상 대각화된다. 스펙트럼 정리 덕분에 $P$를 직교행렬 $Q$로 고를 수 있어
$$A=QDQ^\top\qquad(Q^{-1}=Q^\top).$$

### 기하학적 의미
$A=PDP^{-1}$로 벡터 $x$에 $A$를 곱하는 것은 세 단계다: ① $P^{-1}$로 고유벡터 기저의 좌표로 바꾸고 ② $D$로 축마다 늘리고 ③ $P$로 원래 좌표로 돌아온다. 대칭행렬이면 ①③이 회전(또는 반사)이다.

### 쓸모
- **거듭제곱:** $A^k=PD^kP^{-1}$. $D^k$는 대각 원소만 $k$제곱.
- **행렬식:** $\det A=\det P\det D\det P^{-1}=\prod_i\lambda_i$.

### 손으로 풀어 보는 예제
**(1)** $A=\begin{bmatrix}4&1\\2&3\end{bmatrix}$ (4.2의 예).
- $P=\begin{bmatrix}1&1\\1&-2\end{bmatrix}$ (열 = 고유벡터 $[1,1]^\top$, $[1,-2]^\top$), $D=\begin{bmatrix}5&0\\0&2\end{bmatrix}$.
- $P^{-1}=\frac{1}{-3}\begin{bmatrix}-2&-1\\-1&1\end{bmatrix}=\frac13\begin{bmatrix}2&1\\1&-1\end{bmatrix}$.
- $PDP^{-1}=\begin{bmatrix}5&2\\5&-4\end{bmatrix}\cdot\frac13\begin{bmatrix}2&1\\1&-1\end{bmatrix}=\frac13\begin{bmatrix}12&3\\6&9\end{bmatrix}=\begin{bmatrix}4&1\\2&3\end{bmatrix}$. 맞다.
- $A^3=PD^3P^{-1}$, $D^3=\text{diag}(125,8)$.

**(2) 대칭:** $A=\begin{bmatrix}2&1\\1&2\end{bmatrix}=QDQ^\top$, $Q=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}$, $D=\text{diag}(3,1)$. 고유벡터를 **길이 1로 정규화**해야 $Q^{-1}=Q^\top$가 된다.

### 헷갈리는 점
- 대각화 가능 여부와 가역 여부는 **관계가 없다**(교재 연습문제 4.5). 고유값 0이 있으면 가역이 아니지만 대각화는 될 수 있고, 반대로 가역이어도 결손이면 대각화가 안 된다.
- $P$의 열 순서와 $D$의 대각 순서를 맞춰야 한다.

---

## 4.5 특이값 분해 (Singular Value Decomposition, 119쪽)

### 왜 필요한가
고유분해는 정사각행렬, 그것도 대각화 가능한 것에만 된다. **SVD는 모든 행렬(직사각 포함)에 존재한다.** 교재는 "선형대수의 기본 정리"라고 부를 만큼 중요하다고 강조한다.

### 정의 (정리 4.22, SVD 정리)
랭크 $r$인 $A\in\mathbb R^{m\times n}$은
$$A=U\Sigma V^\top$$
로 분해된다.
- $U\in\mathbb R^{m\times m}$: 직교행렬. 열 $u_i$를 **왼쪽 특이벡터(left-singular vectors)**.
- $V\in\mathbb R^{n\times n}$: 직교행렬. 열 $v_j$를 **오른쪽 특이벡터(right-singular vectors)**.
- $\Sigma\in\mathbb R^{m\times n}$: $\Sigma_{ii}=\sigma_i\ge0$, 나머지는 0. $\sigma_i$를 **특이값(singular values)**\ 이라 하고 $\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_r>0$, 나머지는 0. $\Sigma$는 $A$와 크기가 같아서, $m>n$이면 아래에 0 행이, $m<n$이면 오른쪽에 0 열이 붙는다.
- 0이 아닌 특이값의 개수 = $\text{rk}(A)$.

### 4.5.1 기하학적 의미
$x\mapsto Ax=U\Sigma V^\top x$는 세 단계다:
1. $V^\top$: 입력 공간에서의 기저변환(회전·반사). 오른쪽 특이벡터 방향을 표준축으로 돌린다.
2. $\Sigma$: 축마다 $\sigma_i$배로 늘리고, 차원을 더하거나 뺀다($n$차원 → $m$차원).
3. $U$: 출력 공간에서의 기저변환(회전·반사).
즉 **"회전 → 축 방향 늘이기 → 회전"**. 단위원(구)은 타원(타원체)이 되고, 타원의 반축 길이가 특이값이다.

### 4.5.2 SVD 만드는 법 (구성 절차)
핵심 관찰: $A=U\Sigma V^\top$이면
$$\begin{aligned} A^\top A &= V\Sigma^\top U^\top U\Sigma V^\top \\ &= V(\Sigma^\top\Sigma)V^\top, \\ AA^\top &= U(\Sigma\Sigma^\top)U^\top. \end{aligned}$$
둘 다 대칭 양의 준정부호라 스펙트럼 정리로 직교 대각화된다. 그래서
1. **$A^\top A$를 고유분해** → 고유벡터가 $V$의 열, 고유값 $\lambda_i$에서 $\sigma_i=\sqrt{\lambda_i}$.
2. **왼쪽 특이벡터:** $\sigma_i\ne0$인 $i$에 대해 $u_i=\frac{1}{\sigma_i}Av_i$. (그러면 $u_i$들은 자동으로 정규직교다.) $m>r$이면 나머지 $u$는 이들과 직교하는 단위벡터로 채운다(그람-슈미트나 $\ker A^\top$ 이용).
3. $A=U\Sigma V^\top$로 모은다.

**왜 $u_i=Av_i/\sigma_i$가 정규직교인가:** $u_i^\top u_j=\frac{v_i^\top A^\top Av_j}{\sigma_i\sigma_j}=\frac{\lambda_jv_i^\top v_j}{\sigma_i\sigma_j}$, $i\ne j$면 0, $i=j$면 $\frac{\lambda_i}{\sigma_i^2}=1$.

**주의:** $U$와 $V$를 따로따로 고유분해해서 구하면 부호가 안 맞을 수 있다. 하나를 구한 뒤 $u_i=Av_i/\sigma_i$로 다른 하나를 만드는 것이 안전하다.

### 손으로 풀어 보는 예제
$A=\begin{bmatrix}3&0\\4&5\end{bmatrix}$.
1. $A^\top A=\begin{bmatrix}3&4\\0&5\end{bmatrix}\begin{bmatrix}3&0\\4&5\end{bmatrix}=\begin{bmatrix}25&20\\20&25\end{bmatrix}$.
2. 고유값: $\lambda^2-50\lambda+(625-400)=\lambda^2-50\lambda+225=(\lambda-45)(\lambda-5)$ → $\lambda_1=45$, $\lambda_2=5$.
   - $\lambda=45$: $\begin{bmatrix}-20&20\\20&-20\end{bmatrix}$ → $v_1=\frac1{\sqrt2}[1,1]^\top$.
   - $\lambda=5$: $\begin{bmatrix}20&20\\20&20\end{bmatrix}$ → $v_2=\frac1{\sqrt2}[1,-1]^\top$.
   - $\sigma_1=\sqrt{45}=3\sqrt5$, $\sigma_2=\sqrt5$.
3. $u_1=\frac{Av_1}{\sigma_1}=\frac{1}{3\sqrt5}\cdot\frac{1}{\sqrt2}[3,9]^\top=\frac{1}{\sqrt{10}}[1,3]^\top$, $u_2=\frac{Av_2}{\sigma_2}=\frac{1}{\sqrt5}\cdot\frac1{\sqrt2}[3,-1]^\top=\frac1{\sqrt{10}}[3,-1]^\top$.
   검산: $u_1^\top u_2=\frac{3-3}{10}=0$.
4. $$\begin{aligned} A &= \underbrace{\frac1{\sqrt{10}}\begin{bmatrix}1&3\\3&-1\end{bmatrix}}_{U} \\ &\quad \underbrace{\begin{bmatrix}3\sqrt5&0\\0&\sqrt5\end{bmatrix}}_{\Sigma} \\ &\quad \underbrace{\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}}_{V^\top} \end{aligned}$$.
   ($\det A=15=\sigma_1\sigma_2=3\sqrt5\cdot\sqrt5$로도 확인된다. 절댓값 기준.)

### 고유분해 vs SVD (교재 4.5.2 끝 비교, 시험 단골)
| | 고유분해 $A=PDP^{-1}$ | SVD $A=U\Sigma V^\top$ |
|---|---|---|
| 존재 | 정사각, 고유벡터 $n$개 독립일 때만 | **모든** $m\times n$ 행렬 |
| 기저 | $P$의 열이 직교일 필요 없음 | $U$, $V$ 모두 정규직교 |
| 공간 | 입력·출력 같은 공간, $P$와 $P^{-1}$ | 입력($V$)·출력($U$) 공간이 다를 수 있음 |
| 대각 원소 | 음수·복소수 가능 | 특이값은 항상 실수 $\ge0$ |
| 관계 | 대칭 양의 준정부호 행렬이면 두 분해가 같다 ($U=V=Q$, $\Sigma=D$) | |

또 $A$의 왼쪽 특이벡터는 $AA^\top$의 고유벡터, 오른쪽 특이벡터는 $A^\top A$의 고유벡터, 0이 아닌 특이값의 제곱은 $AA^\top$과 $A^\top A$의 0이 아닌 고유값이다.

---

## 4.6 행렬 근사 (Matrix Approximation, 129쪽)

### 아이디어
SVD를 펼치면 $A$는 **랭크 1 행렬들의 가중합**이다:
$$\begin{gathered} A=\sum_{i=1}^r\sigma_iu_iv_i^\top \\ (u_iv_i^\top\text{는 외적, 랭크 1}). \end{gathered}$$
특이값이 큰 것부터 $k$개만 남기면 **랭크 $k$ 근사**
$$\hat A(k)=\sum_{i=1}^k\sigma_iu_iv_i^\top$$
가 된다. 이미지 압축이면 $m\times n$개 숫자 대신 $k(m+n+1)$개만 저장하면 된다.

### 스펙트럼 노름 (정의 4.23, 정리 4.24)
$$\|A\|_2:=\max_{x\ne0}\frac{\|Ax\|_2}{\|x\|_2}=\sigma_1.$$
"$A$가 벡터를 최대 몇 배까지 늘리는가"이고, 그 값은 가장 큰 특이값이다(교재 연습문제 4.12가 이것을 증명하라는 문제).

### Eckart–Young 정리 (정리 4.25)
랭크 $r$인 $A$와 $k\le r$에 대해
$$\begin{aligned} \hat A(k) &= \arg\min_{\text{rk}(B)=k}\|A-B\|_2, \\ \|A-\hat A(k)\|_2 &= \sigma_{k+1}. \end{aligned}$$
**말로 하면:** 랭크 $k$ 행렬 중에서 $A$에 가장 가까운 것(스펙트럼 노름 기준)은 SVD를 $k$항에서 자른 것이고, 그때 오차는 버린 것 중 가장 큰 특이값 $\sigma_{k+1}$이다. 왜 $\sigma_{k+1}$인가: $A-\hat A(k)=\sum_{i=k+1}^r\sigma_iu_iv_i^\top$의 가장 큰 특이값이 $\sigma_{k+1}$이기 때문(정리 4.24).

(교재 밖 보충: 프로베니우스 노름 $\|A\|_F=\sqrt{\sum_{ij}a_{ij}^2}$에서도 같은 $\hat A(k)$가 최적이고 오차는 $\sqrt{\sigma_{k+1}^2+\cdots+\sigma_r^2}$이다. Eckart–Young–Mirsky 정리라 부른다. 교재 정리 4.25는 스펙트럼 노름으로만 서술한다.)

**10장과의 연결:** PCA는 (중심화한) 데이터 행렬의 랭크 $k$ 근사와 같은 이야기다. 버린 특이값(분산)이 재구성 오차가 된다.

### 손으로 풀어 보는 예제
4.5의 $A=\begin{bmatrix}3&0\\4&5\end{bmatrix}$, 랭크 1 근사:
$$\begin{aligned} \hat A(1) &= \sigma_1u_1v_1^\top \\ &= 3\sqrt5\cdot\frac{1}{\sqrt{10}}\begin{bmatrix}1\\3\end{bmatrix}\cdot\frac{1}{\sqrt2}\begin{bmatrix}1&1\end{bmatrix} \\ &= \frac{3\sqrt5}{\sqrt{20}}\begin{bmatrix}1&1\\3&3\end{bmatrix} \\ &= \frac32\begin{bmatrix}1&1\\3&3\end{bmatrix}=\begin{bmatrix}1.5&1.5\\4.5&4.5\end{bmatrix}. \end{aligned}$$
- 오차 $A-\hat A(1)=\begin{bmatrix}1.5&-1.5\\-0.5&0.5\end{bmatrix}$, 이것은 $\sigma_2u_2v_2^\top$와 같다.
- 스펙트럼 노름 오차 $=\sigma_2=\sqrt5\approx2.24$ (Eckart–Young).

**교재 예제 4.14·4.15**는 영화 평점 행렬에 SVD를 적용해 "SF 좋아하는 사람 / 예술 영화 좋아하는 사람" 같은 숨은 유형을 찾는다. 특이벡터를 해석하는 연습으로 읽어 볼 만하다.

---

## 4.7 행렬 계통도 (Matrix Phylogeny, 134쪽)

교재 그림 4.13은 지금까지의 행렬 종류를 계통도로 정리한다. 요점만:
- **모든 실수 행렬** → 의사역행렬(pseudo-inverse), **SVD**가 존재.
- **정사각행렬** → 행렬식, 대각합 정의.
  - $\det\ne0$ → 가역(정칙).
  - 고유벡터가 $n$개 독립(비결손) → **대각화 가능**.
- **대칭행렬** → 고유값이 실수, 직교 대각화 가능(스펙트럼 정리).
  - **양의 정부호** → 고유값 모두 양수, **숄레스키 분해** 가능, 가역.
- **대각행렬** → 대칭이고, 고유값이 대각 원소.
- **직교행렬** → 가역, $Q^{-1}=Q^\top$, $|\det Q|=1$.
- 가역성과 대각화 가능성은 서로 독립이다.

---

## 핵심 유도 모음 (백지에 쓸 수 있어야 하는 것)

**1. $\det A=\prod\lambda_i$, $\text{tr}A=\sum\lambda_i$ (대각화 가능할 때의 간단한 증명)**
- $\det A=\det(PDP^{-1})=\det P\det D\frac{1}{\det P}=\det D=\prod\lambda_i$
- $\text{tr}A=\text{tr}(PDP^{-1})=\text{tr}(DP^{-1}P)=\text{tr}D=\sum\lambda_i$ (순환 불변)
- (교재의 정리 4.16·4.17은 대각화 가능하지 않아도 성립한다.)

**2. 고유값 구하는 원리**
- $Ax=\lambda x$, $x\ne0$ ⇔ $(A-\lambda I)x=0$이 0 아닌 해를 가짐 ⇔ $A-\lambda I$가 특이 ⇔ $\det(A-\lambda I)=0$.

**3. $A^\top A$는 대칭 양의 준정부호 (정리 4.14)**
- 대칭: $(A^\top A)^\top=A^\top(A^\top)^\top=A^\top A$.
- 준정부호: $x^\top A^\top Ax=(Ax)^\top(Ax)=\|Ax\|^2\ge0$.

**4. 대칭행렬의 서로 다른 고유값의 고유벡터는 직교** (스펙트럼 정리의 핵심 단계, 교재 밖 보충 증명)
- $Ax=\lambda x$, $Ay=\mu y$, $\lambda\ne\mu$.
- $\lambda x^\top y=(Ax)^\top y=x^\top A^\top y=x^\top Ay=\mu x^\top y$.
- $(\lambda-\mu)x^\top y=0$이고 $\lambda\ne\mu$라 $x^\top y=0$.

**5. SVD 구성**
- $A^\top A=V\Sigma^\top\Sigma V^\top$ → $V$와 $\sigma_i^2$를 고유분해로 구함.
- $u_i=Av_i/\sigma_i$ → 정규직교임을 위 4.5.2처럼 보임.

**6. $A^\top A$와 $AA^\top$의 0 아닌 고유값이 같음 (교재 연습문제 4.11)**
- $A^\top Ax=\lambda x$, $\lambda\ne0$이면 $Ax\ne0$이고 $AA^\top(Ax)=A(A^\top Ax)=\lambda(Ax)$. 그래서 $\lambda$는 $AA^\top$의 고유값(고유벡터 $Ax$). 반대 방향도 같다.

**7. 스펙트럼 노름 = $\sigma_1$ (교재 연습문제 4.12)**
- $\|Ax\|^2=x^\top A^\top Ax$. $A^\top A=V\text{diag}(\sigma_i^2)V^\top$이고 $y=V^\top x$로 두면 $\|y\|=\|x\|$이고 $\|Ax\|^2=\sum_i\sigma_i^2y_i^2\le\sigma_1^2\sum_iy_i^2=\sigma_1^2\|x\|^2$. 등호는 $x=v_1$. 그래서 $\max\frac{\|Ax\|}{\|x\|}=\sigma_1$.

---

## 말로 설명하기 (개념 서술형·구술 대비)

서술형 문항이나 구술 질문에 대비해 말로도 설명해 본다.

**Q. 행렬식의 의미는?**
"열벡터들이 만드는 평행육면체의 부피(부호 포함)이고, 선형사상이 부피를 몇 배로 바꾸는지를 나타냅니다. 0이면 공간이 납작해져 정보가 사라지므로 역행렬이 없습니다. $\det(AB)=\det A\det B$이고, 고유값의 곱과 같습니다."

**Q. 고유값과 고유벡터를 설명하고 구하는 방법을 말해 보세요.**
"$Ax=\lambda x$를 만족하는 0 아닌 $x$가 고유벡터, $\lambda$가 고유값입니다. $A$를 곱해도 방향이 그대로이고 크기만 $\lambda$배 되는 방향입니다. $\det(A-\lambda I)=0$을 풀어 고유값을 구하고, 각 고유값마다 $(A-\lambda I)x=0$의 영공간을 구하면 고유벡터입니다."

**Q. 대각화 가능 조건은? 대칭행렬은?**
"일차독립인 고유벡터가 $n$개 있어야 $A=PDP^{-1}$로 대각화됩니다. 고유값이 모두 다르면 충분합니다. 대칭행렬은 스펙트럼 정리에 따라 고유값이 실수이고 정규직교 고유벡터 기저가 있어서 항상 $A=QDQ^\top$로 직교 대각화됩니다. 공분산 행렬이 대칭이라 PCA에서 이 성질을 씁니다."

**Q. SVD는 무엇이고 고유분해와 어떻게 다른가요?**
"모든 행렬을 $U\Sigma V^\top$, 즉 회전, 축 방향 늘이기, 회전으로 분해하는 것입니다. 고유분해는 정사각이고 대각화 가능한 행렬에만 되고 기저가 직교일 필요가 없지만, SVD는 모든 행렬에 존재하고 $U$, $V$가 정규직교이며 특이값이 0 이상입니다. $V$는 $A^\top A$의 고유벡터, 특이값은 그 고유값의 제곱근입니다."

**Q. Eckart–Young 정리를 설명하고 머신러닝에서 어디에 쓰는지 말해 보세요.**
"랭크 $k$ 행렬 중 $A$와 가장 가까운 것은 SVD에서 큰 특이값 $k$개만 남긴 $\sum_{i\le k}\sigma_iu_iv_i^\top$이고, 스펙트럼 노름 오차는 $\sigma_{k+1}$이라는 정리입니다. PCA, 데이터 압축, 추천 시스템의 행렬 분해, 그리고 큰 행렬을 저계수로 근사하는 기법들의 이론적 근거입니다."

**Q. 숄레스키 분해는 언제 되고 어디에 쓰나요?**
"대칭 양의 정부호 행렬만 $LL^\top$(하삼각 $L$)로 유일하게 분해됩니다. 다변수 가우시안에서 표본을 뽑을 때 $x=\mu+Lz$로 쓰고, 행렬식이나 선형 시스템을 안정적으로 계산할 때 씁니다."

**Q. 대각합의 순환 불변성은 어디에 쓰나요?**
"$\text{tr}(ABC)=\text{tr}(CAB)$이므로 스칼라 $x^\top Ax$를 $\text{tr}(Axx^\top)$로 바꿔 쓸 수 있습니다. 기댓값과 대각합의 순서를 바꿔 $\mathbb E[x^\top Ax]=\text{tr}(A\,\mathbb E[xx^\top])$처럼 계산할 때, PCA의 분산 합을 고유값 합으로 바꿀 때 씁니다."

---

## 연습문제

### 확인 문제 (풀이 포함)

**문제 1.** $\det\begin{bmatrix}2&0&0\\5&3&0\\7&1&4\end{bmatrix}$는?
> **풀이:** 하삼각행렬이라 대각 곱 $2\cdot3\cdot4=24$.

**문제 2.** $\det A=3$인 $3\times3$ 행렬에 대해 $\det(2A)$, $\det(A^{-1})$, $\det(A^\top A)$는?
> **풀이:** $2^3\cdot3=24$, $\frac13$, $3\cdot3=9$.

**문제 3.** $A=\begin{bmatrix}1&2\\2&1\end{bmatrix}$의 고유값·고유벡터를 구하고 $\det$, $\text{tr}$과 비교하라.
> **풀이:** $\lambda^2-2\lambda-3=(\lambda-3)(\lambda+1)$. $\lambda=3$: $[1,1]^\top$, $\lambda=-1$: $[1,-1]^\top$. $3\cdot(-1)=-3=\det A$, $3+(-1)=2=\text{tr}A$. 대칭이라 두 고유벡터가 직교한다. 고유값에 음수가 있어 양의 정부호가 아니다.

**문제 4.** $A=\begin{bmatrix}2&1\\0&2\end{bmatrix}$은 대각화 가능한가? 가역인가?
> **풀이:** 고유값 2(대수적 중복도 2), $A-2I=\begin{bmatrix}0&1\\0&0\end{bmatrix}$의 영공간은 1차원 → 결손, **대각화 불가**. $\det=4\ne0$ → **가역**. 둘은 독립적인 성질이다.

**문제 5.** $A=\begin{bmatrix}1&1\\0&2\end{bmatrix}$을 대각화하고 $A^{10}$을 구하는 식을 써라.
> **풀이:** 고유값 1, 2 (삼각행렬이라 대각). $\lambda=1$: $\begin{bmatrix}0&1\\0&1\end{bmatrix}$ → $[1,0]^\top$. $\lambda=2$: $\begin{bmatrix}-1&1\\0&0\end{bmatrix}$ → $[1,1]^\top$. $P=\begin{bmatrix}1&1\\0&1\end{bmatrix}$, $P^{-1}=\begin{bmatrix}1&-1\\0&1\end{bmatrix}$. $A^{10}=P\begin{bmatrix}1&0\\0&1024\end{bmatrix}P^{-1}=\begin{bmatrix}1&1023\\0&1024\end{bmatrix}$.

**문제 6.** $\begin{bmatrix}9&3\\3&5\end{bmatrix}$의 숄레스키 분해를 구하라.
> **풀이:** $l_{11}=3$, $l_{21}=3/3=1$, $l_{22}=\sqrt{5-1}=2$. $L=\begin{bmatrix}3&0\\1&2\end{bmatrix}$.

**문제 7.** $A\in\mathbb R^{5\times3}$, $\text{rk}(A)=2$이면 SVD에서 $U,\Sigma,V$의 크기와 0이 아닌 특이값의 수는?
> **풀이:** $U$: $5\times5$, $\Sigma$: $5\times3$, $V$: $3\times3$. 0이 아닌 특이값 2개.

**문제 8.** $A=\begin{bmatrix}1&1\\1&1\end{bmatrix}$의 SVD와 랭크 1 근사는?
> **풀이:** $A^\top A=\begin{bmatrix}2&2\\2&2\end{bmatrix}$, 고유값 4, 0. $v_1=\frac1{\sqrt2}[1,1]^\top$, $\sigma_1=2$. $u_1=Av_1/2=\frac1{\sqrt2}[1,1]^\top$. $\sigma_2=0$. $A$는 이미 랭크 1이라 $\hat A(1)=2u_1v_1^\top=A$, 오차 0.

**문제 9.** 특이값이 $10,5,1,0.1$인 행렬의 랭크 2 근사의 스펙트럼 노름 오차는?
> **풀이:** $\sigma_3=1$.

**문제 10.** 대칭 양의 정부호 행렬의 SVD와 고유분해가 같은 이유는?
> **풀이:** $A=QDQ^\top$에서 $D$의 원소(고유값)가 모두 양수라 특이값의 조건(0 이상, 실수)을 만족하고, $Q$가 직교행렬이라 $U=V=Q$, $\Sigma=D$로 놓으면 그대로 SVD다.

### 교재 연습문제 안내 (137~138쪽, 답은 sympy로 검산)

| 번호 | 무엇을 묻나 | 답 / 풀이 방향 |
|---|---|---|
| 4.1 | 라플라스·사루스로 $3\times3$ 행렬식 | $\det A=0$ (위 4.1 예제 (3)) |
| 4.2 | $5\times5$ 행렬식 효율적으로 | 2열이 $[0,-1,1,0,0]^\top$로 0이 세 개라 2열을 따라 라플라스 전개하면 $4\times4$ 행렬식 두 개로 줄어든다. 가우스 소거로 삼각화해도 된다. 답 **6** |
| 4.3 | 고유공간 | (a) $\begin{bmatrix}1&0\\1&1\end{bmatrix}$: $\lambda=1$(중복 2), $E_1=\text{span}[[0,1]^\top]$, 결손. (b) $\begin{bmatrix}-2&2\\2&1\end{bmatrix}$: $\lambda=2$: $\text{span}[[1,2]^\top]$, $\lambda=-3$: $\text{span}[[-2,1]^\top]$ |
| 4.4 | $4\times4$ 고유공간 | 특성다항식 $(\lambda-2)(\lambda-1)(\lambda+1)^2$. $E_{-1}=\text{span}[[0,1,1,0]^\top]$(중복 2인데 1차원 → 결손), $E_1=\text{span}[[1,1,1,1]^\top]$, $E_2=\text{span}[[1,0,1,1]^\top]$ |
| 4.5 | 대각화 가능성과 가역성 | $I$: 둘 다 예. $\text{diag}(1,0)$: 대각화 예, 가역 아니오. $\begin{bmatrix}1&1\\0&1\end{bmatrix}$: 대각화 아니오, 가역 예. $\begin{bmatrix}0&1\\0&0\end{bmatrix}$: 둘 다 아니오 |
| 4.6 | 고유공간과 대각화 | (a) $\lambda=5$: $\text{span}[[1,1,0]^\top]$, $\lambda=1$(중복 2): $\text{span}[[-3,1,0]^\top]$ → 결손, 대각화 **불가**. (b) $\lambda=1$: $\text{span}[e_1]$, $\lambda=0$: $\text{span}[[-1,1,0,0]^\top,e_3,e_4]$ → 대각화 **가능** |
| 4.7 | 대각화와 대각형·기저 | (a) 고유값 $2\pm2i$ (복소수) → **실수 범위에서 대각화 불가**. (b) 모두 1인 $3\times3$: 고유값 $3,0,0$, 기저 $[1,1,1]^\top,[-1,1,0]^\top,[-1,0,1]^\top$, $D=\text{diag}(3,0,0)$ (대칭이라 당연히 가능). (c) 특성다항식 $(\lambda-4)^2(\lambda-2)(\lambda-1)$, $\lambda=4$의 고유공간이 1차원 → **불가**. (d) $(\lambda-2)^2(\lambda-1)$, $\lambda=2$의 고유공간 $\text{span}[[2,1,0]^\top,[2,0,1]^\top]$, $\lambda=1$: $\text{span}[[3,-1,3]^\top]$ → **가능**, $D=\text{diag}(1,2,2)$ |
| 4.8 | $\begin{bmatrix}3&2&2\\2&3&-2\end{bmatrix}$의 SVD | $AA^\top=\begin{bmatrix}17&8\\8&17\end{bmatrix}$, 고유값 25, 9 → $\sigma_1=5$, $\sigma_2=3$. $u_1=\frac1{\sqrt2}[1,1]^\top$, $u_2=\frac1{\sqrt2}[1,-1]^\top$. $v_i=A^\top u_i/\sigma_i$: $v_1=\frac1{\sqrt2}[1,1,0]^\top$, $v_2=\frac1{3\sqrt2}[1,-1,4]^\top$, $v_3=\frac13[2,-2,-1]^\top$ ($v_1,v_2$와 직교하는 단위벡터). 여기서는 $m<n$이라 $AA^\top$($2\times2$)부터 푸는 것이 쉽다 |
| 4.9 | $\begin{bmatrix}2&2\\-1&1\end{bmatrix}$의 SVD | $A^\top A=\begin{bmatrix}5&3\\3&5\end{bmatrix}$, 고유값 8, 2. $v_1=\frac1{\sqrt2}[1,1]^\top$, $v_2=\frac1{\sqrt2}[-1,1]^\top$, $\sigma_1=2\sqrt2$, $\sigma_2=\sqrt2$. $u_1=Av_1/\sigma_1=[1,0]^\top$, $u_2=Av_2/\sigma_2=[0,1]^\top$. 즉 $U=I$ |
| 4.10 | 4.8 행렬의 랭크 1 근사 | $\hat A(1)=5u_1v_1^\top=\frac52\begin{bmatrix}1&1&0\\1&1&0\end{bmatrix}$ |
| 4.11 | $A^\top A$와 $AA^\top$의 0 아닌 고유값이 같음 | 위 핵심 유도 6 |
| 4.12 | $\max\|Ax\|/\|x\|=\sigma_1$ | 위 핵심 유도 7 |

---

## 시험 직전 10분 요약

**행렬식**
- $2\times2$: $ad-bc$. $3\times3$: 사루스. 일반: 라플라스 전개(체스판 부호) 또는 소거 후 대각 곱.
- $\det(AB)=\det A\det B$, $\det A^\top=\det A$, $\det A^{-1}=1/\det A$, $\det(\lambda A)=\lambda^n\det A$.
- 행 교환 → 부호 반대, 행 배수 더하기 → 불변, 행에 $\lambda$ 곱 → $\lambda$배.
- $\det A\ne0\iff$ 가역 $\iff\text{rk}=n$. $\det A=\prod\lambda_i$.

**대각합:** $\text{tr}(AB)=\text{tr}(BA)$, 순환 불변, $\text{tr}(xy^\top)=y^\top x$, $\text{tr}A=\sum\lambda_i$.

**고유값:** $\det(A-\lambda I)=0$. $2\times2$: $\lambda^2-\text{tr}A\,\lambda+\det A=0$. 고유벡터 = $\ker(A-\lambda I)$. 기하적 ≤ 대수적 중복도. 다른 고유값의 고유벡터는 독립.

**스펙트럼 정리:** 대칭 → 실수 고유값, 정규직교 고유벡터, $A=QDQ^\top$. $A^\top A$는 대칭 PSD.

**숄레스키:** SPD $A=LL^\top$, $L$ 하삼각, 대각 양수, 유일. $l_{11}=\sqrt{a_{11}}$, $l_{21}=a_{21}/l_{11}$, $l_{22}=\sqrt{a_{22}-l_{21}^2}$.

**대각화:** $A=PDP^{-1}$ ⇔ 독립 고유벡터 $n$개. $A^k=PD^kP^{-1}$. 대각화 ≠ 가역.

**SVD:** 모든 $A=U\Sigma V^\top$. $V$: $A^\top A$의 고유벡터, $\sigma_i=\sqrt{\lambda_i(A^\top A)}$, $u_i=Av_i/\sigma_i$. 0 아닌 특이값 수 = 랭크. 회전 → 늘이기 → 회전.

**근사:** $\hat A(k)=\sum_{i\le k}\sigma_iu_iv_i^\top$. $\|A\|_2=\sigma_1$. Eckart–Young: $\|A-\hat A(k)\|_2=\sigma_{k+1}$ (프로베니우스는 $\sqrt{\sum_{i>k}\sigma_i^2}$, 교재 밖).
