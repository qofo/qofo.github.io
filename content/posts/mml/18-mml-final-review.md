---
title: "MML 시험 직전 최종 정리: 공식, 조건, 증명 뼈대"
slug: "mml-final-review"
date: 2026-10-15
weight: 18
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "머신러닝 수학", "시험 대비", "요약", "선형대수", "확률", "최적화", "선형회귀", "PCA", "GMM", "SVM"]
description: "MML 2~12장에서 시험 직전에 볼 것만 한 편에 모았다. 시험장에서 쓰는 요령, 교재 표기 함정, 장별 공식과 조건, 답안에 그대로 쓰는 증명·유도 뼈대 12개, 서술형 답, 영어 지문 용어, 입실 직전 점검 목록."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재:** Deisenroth·Faisal·Ong, *Mathematics for Machine Learning* ([mml-book.github.io](https://mml-book.github.io/)에 공개된 PDF, 2024-01-15 판). 절과 식 번호는 그 PDF 기준이다.  
> **이 글:** 새 내용은 없다. 장별 글(2~12편)의 핵심과 "시험 직전 10분 요약", [모의고사 풀이](17-mml-mock-exam-solutions.md)에서 시험에 바로 쓰는 공식·조건·증명 뼈대만 골라 다시 썼다. 유도의 단계별 설명은 장별 글에 있다.  
> **범위와 시간:** 기초수학 = MML Part 1(2~7장) 60분, 기초 AI = MML Part 2(8~12장) 60분을 가정했다.

## 1. 시험장에서 쓰는 요령

**먼저 챙길 주제.** 이 범위로 보는 필기의 응시 후기에는 정사영, 기울기 계산, 최적화(경사하강법·라그랑주 승수), 분산 공식 유도, 볼록성, 직교, 고유값, 회전행렬, 이항분포가 나왔다. 영어 지문에 증명 위주로 나온 해도 있었다. 8~12장 범위는 후기를 찾지 못했으므로 대표 유도 다섯 개(정규방정식, 릿지 = MAP, PCA = 고유벡터, GMM의 EM 갱신, SVM 쌍대)를 먼저 챙긴다.

**시간.** 60분에 6문항이면 문항당 약 9분, 마지막 5분은 검토다.

1. 처음 2분 동안 모든 문항을 훑고, 바로 풀 수 있는 문항부터 표시한다.
2. 한 문항에 15분을 넘기지 않는다. 막히면 표시하고 다음 문항으로 간다.
3. 끝까지 못 가는 유도·증명도 출발 식(정의, 라그랑지안, 음의 로그가능도, 특성방정식)과 중간 단계는 남긴다.

**답안 쓰는 법.**

- 증명은 첫 줄에 보일 것을 쓰고 "가정 → 정의에 대입 → 한 줄씩 → 결론(∎)" 순서로 쓴다. 줄마다 쓴 성질(선형성, 대칭, 독립 등)을 괄호로 붙인다.
- 행렬 계산 옆에 크기를 적는다($K\times K$, $1\times n$). 크기가 맞지 않으면 전치를 잘못 붙인 것이다.
- 관례를 한 줄 밝혀 둔다: "기울기는 행벡터(MML 관례)", "공분산 분모는 $N$".
- 영어 지문이면 7절의 낱말부터 확인한다. Show that·Prove는 증명, Derive는 끝까지 유도하라는 뜻이다.

**검산 한 줄** (시간이 남으면 숫자 답마다)

- 고유값: 합 = 대각합, 곱 = 행렬식.
- 사영: 오차 $x-\pi(x)$와 각 기저 벡터의 내적이 0.
- 회귀: 잔차와 $\Phi$의 각 열의 내적이 0.
- SVD: $u_i^\top u_j=0$ ($i\ne j$), $\|A\|_F^2=\sum_i\sigma_i^2$ (원소 제곱합).
- 확률: 책임도의 합이 1, 분산이 0 이상, 조건부 분산이 원래 분산 이하.
- 쌍대: 볼록 문제면 원 문제의 값과 쌍대 문제의 값이 같다.
- SVM: 하드 마진의 서포트 벡터에서 $y_nf(x_n)=1$.
- 미분: 점 하나를 골라 성분으로 직접 미분한 값과 비교한다.

## 2. 표기 함정 (MML 관례)

- 벡터는 열벡터다. $x\in\mathbb R^D$는 $D\times1$이다.
- 스칼라 함수의 기울기는 **행벡터**($1\times D$)다. 그래서 경사하강법은 $x-\gamma(\nabla f)^\top$이고, $\frac{dL}{d\theta}=0^\top$을 풀 때 양변을 전치해 열벡터 방정식으로 바꾼다.
- 야코비안은 (출력 수)×(입력 수) 행렬이다. 행이 출력, 열이 입력.
- 공분산의 분모는 $N$이다($N-1$이 아니다).
- 데이터 행렬: 9장 회귀는 데이터 점이 **행**($N\times D$, $X^\top X$가 나옴), 10장 PCA는 데이터 점이 **열**($D\times N$, $XX^\top$가 나옴).
- $\log$는 자연로그다.
- 라그랑지안은 $f+\sum_i\lambda_ig_i$, 조건은 $g_i\le0$, 승수는 $\lambda_i\ge0$이다.
- AIC·BIC는 "클수록 좋은" 꼴이다. SVM 쌍대 문제는 최소화 꼴(12.41)이다.
- SVM 마진은 가장 가까운 점까지의 거리 $\frac1{\|w\|}$이다. 양쪽을 합친 폭은 $\frac2{\|w\|}$.

## 3. 기초수학 공식 (Part 1, 2~7장)

### 2장 선형대수

- 해집합 = 특수해 하나 + 영공간: $\{x_p+v: v\in\ker A\}$.
  - 특수해: 기약 행 사다리꼴에서 자유변수를 모두 0으로 둔다.
  - 영공간 기저: 오른쪽을 0으로 두고 자유변수 하나만 1, 나머지 자유변수는 0. 자유변수 수만큼 나온다.
- 해가 있다 ⇔ $\text{rk}(A)=\text{rk}([A\mid b])$ (소거 뒤 $[0\ \cdots\ 0\mid c]$, $c\ne0$인 행이 없다). 해가 하나뿐 ⇔ 해가 있고 $\text{rk}(A)=n$(열 수).
- 차원 정리: $\dim\ker A+\text{rk}(A)=n$(열 수).
- 일차독립 판정: 벡터를 열로 세워 소거한다. 모든 열이 피벗 열이면 독립이다.
- 부분공간 판정: (1) $0$을 포함, (2) 덧셈에 닫힘, (3) 스칼라곱에 닫힘. $Ax=0$의 해집합은 부분공간이고, $Ax=b$($b\ne0$)의 해집합은 부분공간이 아니다(아핀 공간).
- 열공간의 기저는 **원래 행렬**의 피벗 열에서 가져온다. 행 연산은 열공간을 바꾼다.
- 정사각행렬 $A$: 역행렬이 있다 ⇔ $\text{rk}A=n$ ⇔ $\ker A=\{0\}$ ⇔ $\det A\ne0$ ⇔ 고유값에 0이 없다.
- 역행렬: 큰 행렬은 $[A\mid I]\to[I\mid A^{-1}]$로 소거한다. 2×2는

$$
\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}
$$

- $(AB)^\top=B^\top A^\top$, $(AB)^{-1}=B^{-1}A^{-1}$, $(A^{-1})^\top=(A^\top)^{-1}$.
- 변환행렬의 $j$번째 열 = $\Phi(b_j)$를 출력 공간의 기저로 나타낸 좌표.
- 기저 변환: $\tilde A_\Phi=T^{-1}A_\Phi S$. 오른쪽부터 읽는다. $S$는 새 입력 좌표를 옛 좌표로 바꾸고, $A_\Phi$로 사상을 적용한 뒤, $T^{-1}$로 새 출력 좌표로 바꾼다. 같은 공간 안에서 기저만 바꾸면 $S^{-1}AS$(닮음).

### 3장 해석기하

- 내적의 조건: 쌍선형, 대칭, 양의 정부호($x\ne0$이면 $\langle x,x\rangle>0$). $\langle x,y\rangle=x^\top Ay$ 꼴이면 $A$가 대칭 양의 정부호여야 한다. 2×2 대칭행렬은 $a_{11}>0$이고 $\det A>0$이면 양의 정부호다.
- 길이 $\|x\|=\sqrt{\langle x,x\rangle}$, 거리 $\|x-y\|$, 각도 $\cos\omega=\frac{\langle x,y\rangle}{\|x\|\,\|y\|}$. 코시-슈바르츠 $|\langle x,y\rangle|\le\|x\|\,\|y\|$.
- 직교는 내적이 0이라는 뜻이고, **어떤 내적을 쓰느냐에 따라 바뀐다.**
- 직선으로의 사영: $\pi(x)=\frac{b^\top x}{b^\top b}\,b$, 사영 행렬 $P=\frac{bb^\top}{b^\top b}$.
- 부분공간으로의 사영($B$의 열 = 기저): 정규방정식 $B^\top B\lambda=B^\top x$를 풀어

$$
\pi_U(x)=B(B^\top B)^{-1}B^\top x
$$

- 기저가 정규직교면 $B^\top B=I$라서 $\pi_U(x)=BB^\top x$.
- 일반 내적 $\langle x,y\rangle=x^\top Ay$로 사영하면 $\lambda=(B^\top AB)^{-1}B^\top Ax$.
- 사영 행렬의 성질: $P^2=P$, $P^\top=P$, $I-P$는 직교여공간으로의 사영. 점과 부분공간 사이의 거리는 $\|x-\pi_U(x)\|$.
- 아핀 공간 $L=x_0+U$로의 사영: $\pi_L(x)=x_0+\pi_U(x-x_0)$.
- 직교여공간: $U^\perp=\ker B^\top$, $\dim U^\perp=D-\dim U$.
- 그람-슈미트: $u_1=b_1$, $u_k=b_k-\sum_{j<k}\frac{u_j^\top b_k}{u_j^\top u_j}u_j$. 정규직교 기저가 필요하면 마지막에 길이로 나눈다.
- 직교행렬 $Q^\top Q=I$: $Q^{-1}=Q^\top$, 길이와 각도를 보존, $\det Q=\pm1$, 고유값의 절댓값이 1.
- 회전행렬 $R(\theta)=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$: 직교행렬이고 $\det R=1$, $R(\alpha)R(\beta)=R(\alpha+\beta)$. 2차원 회전은 순서를 바꿔도 같지만 3차원부터는 순서가 중요하다. 증명은 5.4절.

### 4장 행렬분해

- 행렬식: 2×2는 $ad-bc$, 삼각행렬은 대각 원소의 곱. $\det(AB)=\det A\det B$, $\det A^\top=\det A$, $\det A^{-1}=1/\det A$, $\det(cA)=c^n\det A$.
- 행 연산과 행렬식: 두 행을 바꾸면 부호가 바뀌고, 한 행에 다른 행의 배수를 더하면 그대로이고, 한 행에 $c$를 곱하면 $c$배가 된다.
- 대각합: $\text{tr}(AB)=\text{tr}(BA)$, $\text{tr}(xy^\top)=y^\top x$.
- 고유값: 특성방정식 $\det(A-\lambda I)=0$. 2×2면 $\lambda^2-(\text{tr}A)\lambda+\det A=0$. 고유벡터는 $\ker(A-\lambda I)$의 0 아닌 원소.
- 고유값의 합 = $\text{tr}A$, 곱 = $\det A$. 삼각행렬의 고유값은 대각 원소.
- 서로 다른 고유값의 고유벡터는 일차독립이다. 고유값 $n$개가 모두 다르면 대각화된다.
- 대각화: 독립인 고유벡터가 $n$개 ⇔ $A=PDP^{-1}$. 그러면 $A^k=PD^kP^{-1}$. 대각화 가능과 역행렬 존재는 다른 말이다.
- 스펙트럼 정리(정리 4.15): 대칭행렬은 고유값이 모두 실수이고, 정규직교 고유벡터로 $A=PDP^\top$이라 쓸 수 있다. 증명 뼈대는 5.3절.
- 대칭행렬 $A$가 양의 정부호 ⇔ 모든 고유값이 양수 ⇔ $x\ne0$이면 $x^\top Ax>0$. 준정부호는 각각 "0 이상". $A^\top A$는 언제나 대칭 준정부호다.
- 촐레스키(정리 4.18, 대칭 양의 정부호만): $A=LL^\top$, $L$은 대각이 양수인 하삼각행렬. 2×2면 $l_{11}=\sqrt{a_{11}}$, $l_{21}=a_{21}/l_{11}$, $l_{22}=\sqrt{a_{22}-l_{21}^2}$.
- SVD $A=U\Sigma V^\top$ (모든 행렬):
  1. $A^\top A$의 고유값 $\lambda_i$와 정규직교 고유벡터 $v_i$를 구한다. $\sigma_i=\sqrt{\lambda_i}$ (큰 순서).
  2. $u_i=Av_i/\sigma_i$로 구한다. $u_i$를 $AA^\top$에서 따로 구하면 부호가 어긋날 수 있다.
  - $AA^\top$가 더 작으면 거기서 $u_i$를 구하고 $v_i=A^\top u_i/\sigma_i$.
  - 0이 아닌 특이값의 개수 = 랭크. 모자란 $v_i$는 $\ker A$의 정규직교 기저로 채운다.
- 저랭크 근사: $\hat A_k=\sum_{i\le k}\sigma_iu_iv_i^\top$. $\|A\|_2=\sigma_1$, $\|A-\hat A_k\|_2=\sigma_{k+1}$ (에카르트-영, 정리 4.25). $\|A\|_F^2=\text{tr}(A^\top A)=\sum_i\sigma_i^2$.
- 대칭 준정부호 행렬이면 고유값분해와 SVD가 같다.

### 5장 벡터 미적분

- 크기 규칙: $f:\mathbb R^n\to\mathbb R$의 기울기는 $1\times n$ 행벡터, $f:\mathbb R^n\to\mathbb R^m$의 야코비안은 $m\times n$.
- 연쇄법칙: $\frac{d}{dx}f(g(x))=\frac{\partial f}{\partial g}\frac{\partial g}{\partial x}$, 크기는 $(m\times k)(k\times n)$. 가운데 $k$가 맞물려야 한다.
- 외울 미분($a$, $A$, $B$, $W$는 상수):
  - $\frac{\partial}{\partial x}a^\top x=a^\top$, $\frac{\partial}{\partial x}Ax=A$
  - $\frac{\partial}{\partial x}x^\top Bx=x^\top(B+B^\top)$. $B$가 대칭일 때만 $2x^\top B$.
  - $\frac{\partial}{\partial x}\|Ax-b\|^2=2(Ax-b)^\top A$
  - $\frac{\partial}{\partial s}(x-As)^\top W(x-As)=-2(x-As)^\top WA$ ($W$ 대칭)
  - 스칼라를 행렬로 미분하면 그 행렬과 크기가 같다. $\frac{\partial}{\partial X}a^\top Xb=ab^\top$, $\frac{\partial}{\partial X}\text{tr}(AXB)=A^\top B^\top$, $\frac{\partial}{\partial X}\log\det X=(X^{-1})^\top$.
  - $L=\|y-Wx\|^2$이면 $\frac{dL}{dW}=-2(y-Wx)x^\top$.
  - 공식이 기억나지 않으면 성분 하나($x_k$ 또는 $W_{ij}$)로 미분해서 모은다(5.4절의 $x^\top Bx$ 증명 참고).
- 활성화 함수의 미분: $\tanh'=1-\tanh^2$, $\sigma'=\sigma(1-\sigma)$, ReLU는 입력이 양수면 1, 아니면 0.
- 역전파: 출력 쪽부터 "손실을 각 층 출력으로 미분한 값"을 구해 저장하고 아래층에서 다시 쓴다. 층 $z=Wx$에서 $\delta$를 손실을 $z$로 미분한 값을 열벡터로 세운 것이라 하면 $\frac{\partial L}{\partial W}=\delta x^\top$, 아래층으로 넘기는 값은 $W^\top\delta$.
- 헤시안 $H_{ij}=\frac{\partial^2f}{\partial x_i\partial x_j}$(대칭). 2차 테일러 근사(**$\frac12$을 빠뜨리지 않는다**):

$$
\begin{aligned}
f(x_0+h)\approx{}&f(x_0)+\nabla f(x_0)\,h\\
&+\tfrac12h^\top H(x_0)\,h
\end{aligned}
$$

- 정류점(기울기 0) 판정: $H$의 고유값이 모두 양수면 극소, 모두 음수면 극대, 부호가 섞이면 안장점, 0이 있으면 이 방법으로 판정할 수 없다.
  - 2×2: $\det H<0$이면 안장점. $\det H>0$이고 $\text{tr}H>0$이면 극소, $\text{tr}H<0$이면 극대.

### 6장 확률과 분포

- 합 규칙 $p(x)=\int p(x,y)\,dy$, 곱 규칙 $p(x,y)=p(y\mid x)\,p(x)$. 베이즈 정리의 분모는 합 규칙으로 "관측이 나오는 모든 경우"를 더한 것이다:

$$
\begin{aligned}
p(x\mid y)&=\frac{p(y\mid x)\,p(x)}{p(y)}\\
p(y)&=\int p(y\mid x)\,p(x)\,dx
\end{aligned}
$$

- 기댓값은 선형이다: $\mathbb E[aX+b]=a\mathbb E[X]+b$, $\mathbb E[X+Y]=\mathbb E[X]+\mathbb E[Y]$ (독립이 아니어도 된다).
- 분산: $\mathbb V[X]=\mathbb E[X^2]-(\mathbb E[X])^2$, $\mathbb V[aX+b]=a^2\mathbb V[X]$. 유도는 5.1절.
- 공분산: $\text{Cov}[X,Y]=\mathbb E[XY]-\mathbb E[X]\mathbb E[Y]$, $\mathbb V[X+Y]=\mathbb V[X]+\mathbb V[Y]+2\,\text{Cov}[X,Y]$.
- 독립이면 공분산이 0이다. 거꾸로는 성립하지 않는다(결합 가우시안이면 둘이 같은 말).
- 벡터: $\mathbb V[x]=\mathbb E[xx^\top]-\mu\mu^\top$, $\mathbb V[Ax+b]=A\Sigma A^\top$.
- 자주 쓰는 분포:
  - 베르누이 $\text{Ber}(\mu)$: 평균 $\mu$, 분산 $\mu(1-\mu)$.
  - 이항 $\text{Bin}(N,\mu)$: $p(m)=\binom Nm\mu^m(1-\mu)^{N-m}$, 평균 $N\mu$, 분산 $N\mu(1-\mu)$.
  - 베타 $\text{Beta}(\alpha,\beta)\propto\mu^{\alpha-1}(1-\mu)^{\beta-1}$: 평균 $\frac{\alpha}{\alpha+\beta}$, 분산 $\frac{\alpha\beta}{(\alpha+\beta)^2(\alpha+\beta+1)}$, 최빈값 $\frac{\alpha-1}{\alpha+\beta-2}$($\alpha,\beta>1$).
  - 균등 $\mathcal U(a,b)$: 평균 $\frac{a+b}2$, 분산 $\frac{(b-a)^2}{12}$.
  - 지수분포(모수 $\lambda$): $p(x)=\lambda e^{-\lambda x}$($x\ge0$), 평균 $\frac1\lambda$, 분산 $\frac1{\lambda^2}$.
- 가우시안 $\mathcal N(\mu,\Sigma)$의 밀도:

$$
p(x)=\frac{\exp\!\big(-\frac12(x-\mu)^\top\Sigma^{-1}(x-\mu)\big)}{(2\pi)^{D/2}\,|\Sigma|^{1/2}}
$$

- 가우시안 주변분포: 해당 블록만 떼어 온다. $p(x_a)=\mathcal N(\mu_a,\Sigma_{aa})$.
- 가우시안 조건부분포 $p(x_a\mid x_b)=\mathcal N(\mu_{a\mid b},\Sigma_{a\mid b})$. 조건부 분산에는 관측값 $x_b$가 없고, 원래 분산 $\Sigma_{aa}$보다 작아진다:

$$
\begin{aligned}
\mu_{a\mid b}&=\mu_a+\Sigma_{ab}\Sigma_{bb}^{-1}(x_b-\mu_b)\\
\Sigma_{a\mid b}&=\Sigma_{aa}-\Sigma_{ab}\Sigma_{bb}^{-1}\Sigma_{ba}
\end{aligned}
$$

- 가우시안 선형변환: $y=Ax+b$이면 $y\sim\mathcal N(A\mu+b,\ A\Sigma A^\top)$. 독립인 두 가우시안의 합은 $\mathcal N(\mu_x+\mu_y,\ \Sigma_x+\Sigma_y)$.
- 가우시안 밀도의 곱: $\mathcal N(x\mid a,A)\,\mathcal N(x\mid b,B)=c\,\mathcal N(x\mid c_0,C)$, $C=(A^{-1}+B^{-1})^{-1}$, $c_0=C(A^{-1}a+B^{-1}b)$, $c=\mathcal N(a\mid b,A+B)$ (6.74~6.76). 정밀도(분산의 역수)가 더해지고 평균은 정밀도로 가중 평균한다.
- 켤레 사전분포:
  - 베타-이항: 사전 $\text{Beta}(\alpha,\beta)$, $N$번 중 앞면 $h$번 → 사후 $\text{Beta}(\alpha+h,\ \beta+N-h)$. 사전의 $\alpha,\beta$는 "미리 본 앞면·뒷면 수"처럼 작동한다.
  - 가우시안 평균(잡음 분산 $\sigma^2$를 알 때), 사전 $\mathcal N(\mu_0,\sigma_0^2)$ → 사후 정밀도 $\frac1{\sigma_N^2}=\frac1{\sigma_0^2}+\frac N{\sigma^2}$, 사후 평균 $\mu_N=\sigma_N^2\big(\frac{\mu_0}{\sigma_0^2}+\frac{1}{\sigma^2}\sum_nx_n\big)$.
- 변수 변환(1차원, $g$가 단조): $p_Y(y)=p_X(g^{-1}(y))\left|\frac{d}{dy}g^{-1}(y)\right|$. 다차원이면 야코비안 행렬식의 절댓값 $|\det J|$. 단조가 아니면 분포함수 $F_Y(y)=P(g(X)\le y)$부터 구해서 미분한다.
- 지수족: $p(x\mid\theta)=h(x)\exp\big(\theta^\top\phi(x)-A(\theta)\big)$. 베르누이는 $\theta=\log\frac{\mu}{1-\mu}$, $\phi(x)=x$, $A(\theta)=\log(1+e^\theta)$.
- 연속 확률변수에서 한 점의 확률은 0이고, 밀도 값은 1보다 클 수 있다.

### 7장 연속 최적화

- 경사하강법: $x_{t+1}=x_t-\gamma\,(\nabla f(x_t))^\top$. 2차 함수 $\frac12x^\top Ax-b^\top x$에서는 오차가 고유벡터 방향마다 매번 $(1-\gamma\lambda_i)$배가 되므로 $0<\gamma<\frac2{\lambda_{\max}}$일 때 수렴한다(교재 밖 보충).
- 모멘텀(7.11~7.12): $x_{t+1}=x_t-\gamma(\nabla f(x_t))^\top+\alpha\,\Delta x_t$, $\Delta x_t=x_t-x_{t-1}$. 진동하는 방향은 상쇄되고 일정한 방향은 빨라진다.
- 확률적 경사하강법: 데이터 일부(미니배치)의 기울기로 갱신한다. 그 기댓값이 전체 기울기에 비례해 평균적으로 맞는 방향이고, 계산이 싸다.
- 제약 문제 $\min f(x)$, 조건 $g_i(x)\le0$:
  - 라그랑지안 $\mathfrak L(x,\lambda)=f(x)+\sum_i\lambda_ig_i(x)$, $\lambda_i\ge0$. $g\ge0$ 꼴로 주어지면 부호를 바꿔 $\le0$ 꼴로 넣는다. 등식 조건의 승수는 부호 제한이 없다.
  - 쌍대 함수 $\mathfrak D(\lambda)=\min_x\mathfrak L(x,\lambda)$는 원래 문제와 상관없이 **언제나 오목**이다. 쌍대 문제는 $\max_{\lambda\ge0}\mathfrak D(\lambda)$.
  - 약쌍대성 $d^*\le p^*$는 언제나, 강쌍대성 $d^*=p^*$는 볼록 문제에서 성립한다(7.3절). 증명은 5.7절.
- 손으로 푸는 순서: (1) $\mathfrak L$을 쓴다 → (2) $x$로 미분해 0으로 놓고 $x(\lambda)$를 구한다 → (3) 대입해 $\mathfrak D(\lambda)$ → (4) $\lambda\ge0$에서 최대화 → (5) $x(\lambda^*)$로 원래 해를 복원하고 $p^*=d^*$인지 본다.
- KKT 조건(교재 밖 보충, 교재는 12장 여백에서 이름만 언급): (1) $\nabla_x\mathfrak L=0$, (2) $g_i\le0$, (3) $\lambda_i\ge0$, (4) $\lambda_ig_i=0$.
  - (4)에서: $g_i<0$(느슨한 조건)이면 $\lambda_i=0$. $\lambda_i>0$이면 $g_i=0$(꽉 낀 조건). $g_i=0$이면서 $\lambda_i=0$일 수도 있다.
  - 제약 없는 최소점이 조건을 어기면 그 조건은 꽉 낀다($g=0$)고 놓고 푼다.
- 볼록 함수:
  - 정의: $f(\theta x+(1-\theta)y)\le\theta f(x)+(1-\theta)f(y)$, $0\le\theta\le1$.
  - 미분 가능하면 $f(y)\ge f(x)+\nabla f(x)(y-x)$ (접선이 그래프 아래).
  - 두 번 미분 가능하면 헤시안이 준정부호(1차원이면 $f''\ge0$).
  - 볼록을 지키는 연산: 음이 아닌 가중합, 점별 최댓값, 아핀 합성 $f(Ax+b)$.
  - 자주 쓰는 볼록 함수: $x^2$, $e^x$, $-\log x$와 $x\log x$($x>0$), 노름 $\|x\|$, 힌지 $\max\{0,1-t\}$.
  - 볼록 함수를 볼록 집합에서 최소화하면 국소 최소 = 전역 최소. 젠센 부등식 $f(\mathbb E[X])\le\mathbb E[f(X)]$ (7.30~7.31).
- 선형계획의 쌍대(예제 7.5): $\min_xc^\top x$, 조건 $Ax\le b$ → $\max_\lambda-b^\top\lambda$, 조건 $c+A^\top\lambda=0$, $\lambda\ge0$.
- 2차 계획의 쌍대($Q$ 양의 정부호): $\min\frac12x^\top Qx+c^\top x$, 조건 $Ax\le b$ →

$$
\begin{aligned}
\max_{\lambda\ge0}\ &-\tfrac12(c+A^\top\lambda)^\top Q^{-1}(c+A^\top\lambda)\\
&-\lambda^\top b
\end{aligned}
$$

- 볼록 켤레(정의 7.4): $f^*(s)=\sup_x\big(s^\top x-f(x)\big)$. 예: $f(x)=\frac12x^2$이면 $f^*(s)=\frac12s^2$.

## 4. 기초 AI 공식 (Part 2, 8~12장)

### 8장 모델과 데이터

- 경험적 위험 $R_{\text{emp}}=\frac1N\sum_n\ell(y_n,f(x_n,\theta))$. 진짜 목표인 처음 보는 데이터의 기대 위험을 대신하는 값이고, 훈련 데이터로 쟀으므로 낙관적이다.
- 과적합을 막는 법: 정규화($+\lambda\|\theta\|^2$), $K$겹 교차검증(데이터를 $K$묶음으로 나눠 한 묶음씩 돌아가며 검증), 중첩 교차검증(모델 선택과 성능 평가에 서로 다른 조각을 씀).
- 매개변수 $\theta$는 학습으로 정하고, 초매개변수($\lambda$, 다항식 차수, $K$ 등)는 사람이 정하거나 교차검증으로 고른다.
- MLE: 음의 로그가능도 $-\sum_n\log p(y_n\mid x_n,\theta)$를 최소화. 가우시안 잡음이면 최소제곱과 같다.
- MAP: 위 식에 $-\log p(\theta)$를 더해 최소화. 가우시안 사전 $\mathcal N(0,b^2I)$이면 L2 정규화이고 $\lambda=\sigma^2/b^2$. 라플라스 사전이면 L1 정규화(교재 밖).
- MAP도 점추정이다. 베이즈 추론은 사후분포 전체를 쓰고, 예측을 $\int p(y_*\mid x_*,\theta)\,p(\theta\mid\mathcal D)\,d\theta$로 한다.
- 잠재변수 모델: $p(x\mid\theta)=\int p(x\mid z,\theta)\,p(z)\,dz$ (10장 PPCA, 11장 GMM).
- 방향 그래프 모델의 인수분해: $p(x_1,\dots,x_K)=\prod_kp(x_k\mid\text{Pa}_k)$ (부모 노드에 대한 조건부의 곱).
- d-분리 세 모양:
  - 사슬 $a\to b\to c$와 갈래 $a\leftarrow b\to c$: $b$를 모르면 열림, $b$를 **알면 막힘**.
  - 충돌 $a\to b\leftarrow c$: $b$와 그 자손을 모두 모르면 **막힘**, $b$나 그 자손 하나라도 알면 열림. 도둑($a$)과 지진($c$)은 서로 무관하지만, 경보($b$)가 울린 것을 알면 지진 소식이 도둑일 가능성을 낮춘다(설명해 버리기).
  - $A$에서 $B$로 가는 모든 경로가 막혀야 $A\perp B\mid C$다.
- 모델 선택: 증거(주변가능도) $p(\mathcal D\mid M)=\int p(\mathcal D\mid\theta,M)\,p(\theta\mid M)\,d\theta$가 큰 모델. 두 모델의 증거 비가 베이즈 인자.
- 정보 기준(8.48~8.49, **클수록 좋다**): AIC $=\log p(x\mid\theta)-M$, BIC $=\log p(x\mid\theta)-\frac12M\log N$. $M$은 매개변수 수, $N$은 데이터 수. $N\ge8$이면 BIC의 벌점이 더 크다.

### 9장 선형 회귀

- 모델 $y=\Phi\theta+\epsilon$, $\epsilon\sim\mathcal N(0,\sigma^2I)$. 설계 행렬 $\Phi$는 $N\times K$이고 $n$번째 행이 $\phi(x_n)^\top$. $\theta$에 대해 일차라서 "선형"이다($x$에 대해서는 곡선이어도 된다).
- MLE(9.19): 정규방정식 $\Phi^\top\Phi\theta=\Phi^\top y$ → $\theta_{\text{ML}}=(\Phi^\top\Phi)^{-1}\Phi^\top y$. 잡음 분산(9.22): $\sigma^2_{\text{ML}}=\frac1N\|y-\Phi\theta_{\text{ML}}\|^2$.
- 기하학적 뜻: $\hat y=\Phi\theta_{\text{ML}}$은 $y$를 $\Phi$의 열공간에 직교 사영한 점이다. 잔차는 모든 열과 직교한다: $\Phi^\top(y-\hat y)=0$.
- MAP(9.31, 사전 $\mathcal N(0,b^2I)$): $\theta_{\text{MAP}}=\big(\Phi^\top\Phi+\frac{\sigma^2}{b^2}I\big)^{-1}\Phi^\top y$. 이 역행렬은 언제나 있다.
- 베이즈 선형회귀(9.43, 사전 $\mathcal N(m_0,S_0)$):

$$
\begin{aligned}
S_N&=(S_0^{-1}+\sigma^{-2}\Phi^\top\Phi)^{-1}\\
m_N&=S_N(S_0^{-1}m_0+\sigma^{-2}\Phi^\top y)
\end{aligned}
$$

- 예측분포(9.57): $p(y_*\mid x_*,\mathcal D)=\mathcal N\big(\phi_*^\top m_N,\ \phi_*^\top S_N\phi_*+\sigma^2\big)$. 앞 항은 매개변수를 모르는 데서 오는 불확실성(데이터가 없는 곳에서 커짐), $\sigma^2$은 줄일 수 없는 잡음.
- 주변가능도: $p(y\mid X)=\mathcal N\big(y\mid\Phi m_0,\ \Phi S_0\Phi^\top+\sigma^2I\big)$.
- $m_0=0$, $S_0=b^2I$이면 $m_N=\theta_{\text{MAP}}$ (가우시안은 평균이 최빈값).
- 크기: $\Phi^\top\Phi$는 $K\times K$, 사영 행렬 $\Phi(\Phi^\top\Phi)^{-1}\Phi^\top$은 $N\times N$이고 대각합이 $K$.
- 데이터 수가 특징 수보다 적으면($N<K$) $\Phi^\top\Phi$의 역행렬이 없어 MLE가 하나로 정해지지 않는다. MAP는 풀린다.
- 차수를 올리면 훈련 오차는 계속 줄지만 시험 오차는 어느 순간부터 커진다(과적합).

### 10장 PCA

- 평균부터 뺀다. $X=[x_1,\dots,x_N]$($D\times N$), 공분산 $S=\frac1NXX^\top$($D\times D$, 대칭 준정부호).
- 주성분 방향: $Sb=\lambda b$, $\|b\|=1$. 그 방향 좌표의 분산이 $\lambda$이므로 고유값이 큰 순서로 $M$개를 고른다.
- 좌표(인코딩) $z_n=B^\top(x_n-\mu)$는 수 $M$개, 복원 $\tilde x_n=\mu+BB^\top(x_n-\mu)$는 $D$차원 점. **복원할 때 평균을 다시 더한다.**
- 남긴 분산 $\sum_{m\le M}\lambda_m$, 재구성 오차(10.44) $J_M=\frac1N\sum_n\|x_n-\tilde x_n\|^2=\sum_{j>M}\lambda_j$ (**버린** 고유값의 합). 설명된 분산 비율은 $\sum_{m\le M}\lambda_m/\text{tr}\,S$.
- SVD와의 관계: $X=U\Sigma V^\top$이면 주성분 = $U$의 열, $\lambda_d=\sigma_d^2/N$. 상위 $M$개로 복원한 $U_M\Sigma_MV_M^\top$은 에카르트-영 정리로 계수 $M$ 이하 행렬 중 $X$에 가장 가깝다.
- $N<D$일 때(10.5절): $N\times N$ 문제 $\frac1NX^\top Xc=\lambda c$를 푼다. $Xc$가 $S$의 같은 고유값의 고유벡터이고, $\|c\|=1$이면 $\|Xc\|^2=N\lambda$라서 $b=\frac{Xc}{\sqrt{N\lambda}}$.
- PPCA: $z\sim\mathcal N(0,I)$, $x=Bz+\mu+\epsilon$, $\epsilon\sim\mathcal N(0,\sigma^2I)$.
  - 주변분포(10.70): $p(x)=\mathcal N(\mu,\ BB^\top+\sigma^2I)$.
  - 사후분포 $p(z\mid x)=\mathcal N(m,C)$: $m=B^\top(BB^\top+\sigma^2I)^{-1}(x-\mu)$, $C=I-B^\top(BB^\top+\sigma^2I)^{-1}B$.
  - 잡음의 최대가능도(10.79): $\sigma^2_{\text{ML}}=\frac1{D-M}\sum_{j>M}\lambda_j$ (버린 방향의 평균 분산).
- 특징마다 단위가 다르면 표준화(각 특징을 표준편차로 나눔)부터 한다.

### 11장 GMM과 EM

- 모델 $p(x)=\sum_k\pi_k\mathcal N(x\mid\mu_k,\Sigma_k)$, $\pi_k\ge0$, $\sum_k\pi_k=1$. 로그가능도 $\sum_n\log\sum_k\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)$는 로그 안에 합이 있어 닫힌 해가 없다.
- 책임도(11.17): $r_{nk}=\frac{\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)}{\sum_j\pi_j\mathcal N(x_n\mid\mu_j,\Sigma_j)}$. 점 $x_n$이 성분 $k$에서 나왔을 사후확률이고, 점마다 $\sum_kr_{nk}=1$.
- $N_k=\sum_nr_{nk}$(성분 $k$의 유효 데이터 수), $\sum_kN_k=N$.
- M 단계 갱신(정리 11.1~11.3):
  - $\mu_k=\frac1{N_k}\sum_nr_{nk}x_n$
  - $\Sigma_k=\frac1{N_k}\sum_nr_{nk}(x_n-\mu_k)(x_n-\mu_k)^\top$ (**새** $\mu_k$를 쓴다)
  - $\pi_k=\frac{N_k}{N}$
- EM: 초기값 → E 단계($r_{nk}$ 계산) → M 단계($\mu\to\Sigma\to\pi$) → 로그가능도가 거의 안 변할 때까지 반복. 매 반복 로그가능도가 줄지 않지만 국소 최댓값에서 멈출 수 있어 초기값에 따라 결과가 다르다.
- 잠재변수 관점: 원-핫 $z$로 $p(z_k=1)=\pi_k$, $p(x\mid z_k=1)=\mathcal N(x\mid\mu_k,\Sigma_k)$. 합 규칙이 GMM, 베이즈 정리가 책임도다.
- 한 성분이 점 하나에 붙어 분산이 0으로 가면 가능도가 무한대가 된다. 공분산을 모두 $\sigma^2I$로 두고 $\sigma\to0$이면 가장 가까운 평균에 딱 잘라 배정하는 K-평균이 된다.

### 12장 SVM

- 정답 $y_n\in\{+1,-1\}$, 초평면 $\langle w,x\rangle+b=0$, 예측은 $f(x)=\langle w,x\rangle+b$의 부호. $w$는 초평면에 수직이다.
- 점과 초평면 사이의 (부호 있는) 거리: $\frac{\langle w,x\rangle+b}{\|w\|}$.
- 하드 마진(12.18): 가장 가까운 점에서 $y_nf(x_n)=1$이 되게 크기를 맞추면 마진은 $\frac1{\|w\|}$.

$$
\min_{w,b}\ \tfrac12\|w\|^2\quad\text{s.t.}\quad y_n(\langle w,x_n\rangle+b)\ge1
$$

- 소프트 마진(12.26a): 여유 변수 $\xi_n\ge0$로 조건을 $y_nf(x_n)\ge1-\xi_n$으로 풀고 $\frac12\|w\|^2+C\sum_n\xi_n$을 최소화. $C$가 크면 틀리는 점을 강하게 막아 마진이 좁아진다.
- 힌지 손실(12.31): $\xi_n=\max\{0,\ 1-y_nf(x_n)\}$을 넣으면 제약 없는 문제가 된다. $t=yf(x)$에 대해 $t\ge1$이면 0, $t=0.5$면 0.5, $t=-1$이면 2.
- 쌍대에서 쓰는 세 식: $w=\sum_n\alpha_ny_nx_n$(12.38), $\sum_n\alpha_ny_n=0$, $0\le\alpha_n\le C$ (하드 마진이면 위 제한이 없다).
- 쌍대 문제(12.41, 최소화 꼴), 조건은 $\sum_iy_i\alpha_i=0$, $0\le\alpha_i\le C$:

$$
\begin{aligned}
\min_\alpha\ &\tfrac12\textstyle\sum_{i,j}y_iy_j\alpha_i\alpha_j\langle x_i,x_j\rangle\\
&-\textstyle\sum_i\alpha_i
\end{aligned}
$$

- $\alpha_n$으로 점 읽기(KKT):
  - $\alpha_n=0$ ⇒ $y_nf(x_n)\ge1$ (마진 밖 또는 경계 위, $w$에 기여하지 않음)
  - $0<\alpha_n<C$ ⇒ $y_nf(x_n)=1$ (정확히 경계 위). 이 점에서 $b=y_n-\langle w,x_n\rangle$.
  - $\alpha_n=C$ ⇒ $y_nf(x_n)\le1$ (대개 마진 안쪽이거나 틀린 점)
  - $\alpha_n>0$인 점이 서포트 벡터다. 경계 위의 점이라도 $\alpha_n=0$일 수 있다.
- 커널: 쌍대에는 내적만 들어가므로 $\langle x_i,x_j\rangle$를 $k(x_i,x_j)=\langle\phi(x_i),\phi(x_j)\rangle$로 바꾼다. 예: 2차원에서 $(x^\top y)^2$는 $\phi(x)=[x_1^2,\ \sqrt2x_1x_2,\ x_2^2]$의 내적. RBF $k(x,y)=\exp\big(-\frac{\|x-y\|^2}{2\ell^2}\big)$.
- 유효한 커널: 대칭이고, 어떤 데이터에서도 그람 행렬 $K_{ij}=k(x_i,x_j)$가 준정부호. 예측 $f(x)=\sum_n\alpha_ny_nk(x_n,x)+b$ (서포트 벡터만 더하면 된다).
- SVM은 확률이나 불확실성을 내지 않는다.

## 5. 증명·유도 뼈대

답안에 이 순서 그대로 쓰면 된다. 단계별 설명이 더 필요하면 해당 장을 다시 본다.

### 5.1 분산 공식

$\mu=\mathbb E[X]$는 상수이므로 기댓값의 선형성으로

$$
\begin{aligned}
\mathbb V[X]&=\mathbb E[(X-\mu)^2]\\
&=\mathbb E[X^2]-2\mu\,\mathbb E[X]+\mu^2\\
&=\mathbb E[X^2]-\mu^2
\end{aligned}
$$

- 따름 결과: $\mathbb V[X]\ge0$이라 $\mathbb E[X^2]\ge(\mathbb E[X])^2$.
- 벡터판도 같은 전개다: $\mathbb V[x]=\mathbb E[xx^\top]-\mu\mu^\top$.
- 선형변환: $y=Ax+b$이면 $y-\mathbb E[y]=A(x-\mu)$이고, $A$는 상수라 기댓값 밖으로 나오므로 $\mathbb V[y]=A\,\mathbb E[(x-\mu)(x-\mu)^\top]A^\top=A\Sigma A^\top$.
- 독립이면 분산이 더해진다: 교차항 $\mathbb E[(X-\mu_X)(Y-\mu_Y)]=\mathbb E[X-\mu_X]\,\mathbb E[Y-\mu_Y]=0$.

### 5.2 이항분포의 평균과 분산

$X=\sum_{i=1}^NB_i$, $B_i\sim\text{Ber}(\mu)$는 서로 독립이라고 쓴다.

1. $\mathbb E[B_i]=1\cdot\mu+0\cdot(1-\mu)=\mu$.
2. $B_i$는 0 또는 1이라 $B_i^2=B_i$, 그래서 $\mathbb E[B_i^2]=\mu$이고 $\mathbb V[B_i]=\mu-\mu^2=\mu(1-\mu)$ (5.1절 공식).
3. 기댓값의 선형성으로 $\mathbb E[X]=N\mu$.
4. 독립이라 분산이 더해지므로 $\mathbb V[X]=N\mu(1-\mu)$. ∎

### 5.3 대칭행렬: 고유값은 실수, 고유벡터는 직교

**(a) 고유값이 실수다.** $Ax=\lambda x$, $x\ne0$ ($\lambda$, $x$가 복소수일 수도 있다고 둔다). $\bar x$는 각 성분의 켤레복소수다.

1. 왼쪽에 $\bar x^\top$을 곱하면 $\bar x^\top Ax=\lambda\,\bar x^\top x$. 여기서 $\bar x^\top x=\sum_i|x_i|^2>0$은 실수다.
2. $s=\bar x^\top Ax$라 하면 $A$가 실수 행렬이라 $\bar s=x^\top A\bar x$.
3. $1\times1$은 전치해도 같으므로 $\bar s=(x^\top A\bar x)^\top=\bar x^\top A^\top x=\bar x^\top Ax=s$ ($A^\top=A$).
4. $s$가 실수이므로 $\lambda=s/(\bar x^\top x)$도 실수다. ∎

**(b) 서로 다른 고유값의 고유벡터는 직교한다.** $Ax=\lambda_1x$, $Ay=\lambda_2y$, $\lambda_1\ne\lambda_2$.

$$
\begin{aligned}
\lambda_1x^\top y&=(Ax)^\top y=x^\top A^\top y\\
&=x^\top Ay=\lambda_2x^\top y
\end{aligned}
$$

따라서 $(\lambda_1-\lambda_2)\,x^\top y=0$이고 $\lambda_1\ne\lambda_2$이므로 $x^\top y=0$. ∎

### 5.4 직교행렬과 회전행렬

**직교행렬** $Q^\top Q=I$:

- 길이 보존: $\|Qx\|^2=x^\top Q^\top Qx=x^\top x=\|x\|^2$. 내적 보존 $\langle Qx,Qy\rangle=\langle x,y\rangle$이라 각도도 보존된다.
- $\det(Q)^2=\det(Q^\top)\det(Q)=\det(Q^\top Q)=1$이라 $\det Q=\pm1$.
- $Qx=\lambda x$이면 $\|x\|=\|Qx\|=|\lambda|\,\|x\|$라 $|\lambda|=1$.

**회전행렬** $R(\theta)$, $c=\cos\theta$, $s=\sin\theta$:

$$
\begin{aligned}
R^\top R&=\begin{bmatrix}c&s\\-s&c\end{bmatrix}\begin{bmatrix}c&-s\\s&c\end{bmatrix}\\
&=\begin{bmatrix}c^2+s^2&-cs+sc\\-sc+cs&s^2+c^2\end{bmatrix}=I
\end{aligned}
$$

- $\det R=c^2+s^2=1$.
- $R(\alpha)R(\beta)$를 곱하면 원소가 $\cos\alpha\cos\beta-\sin\alpha\sin\beta=\cos(\alpha+\beta)$, $\sin\alpha\cos\beta+\cos\alpha\sin\beta=\sin(\alpha+\beta)$가 되어 $R(\alpha+\beta)$ (덧셈정리).
- 고유값: $\det(R-\lambda I)=(c-\lambda)^2+s^2=\lambda^2-2c\lambda+1=0$ → $\lambda=\cos\theta\pm i\sin\theta$. 절댓값은 1이고, $\theta\ne0,\pi$이면 실수 고유값이 없다(돌려도 방향이 그대로인 벡터가 없다).

### 5.5 $A^\top A$와 사영 행렬

- $A^\top A$는 대칭: $(A^\top A)^\top=A^\top A$. 준정부호: $x^\top A^\top Ax=\|Ax\|^2\ge0$.
- $\ker(A^\top A)=\ker A$: $Ax=0$이면 $A^\top Ax=0$. 거꾸로 $A^\top Ax=0$이면 $x^\top A^\top Ax=\|Ax\|^2=0$이라 $Ax=0$. 두 행렬의 열 수가 같으므로 차원 정리로 $\text{rk}(A^\top A)=\text{rk}(A)$. 그래서 $A$의 열이 독립이면 $A^\top A$는 역행렬이 있다.
- $P=B(B^\top B)^{-1}B^\top$:
  - $P^2=B(B^\top B)^{-1}(B^\top B)(B^\top B)^{-1}B^\top=P$.
  - $B^\top B$가 대칭이라 그 역행렬도 대칭이므로 $P^\top=P$.
  - 오차가 직교: $B^\top(x-Px)=B^\top x-B^\top x=0$.

### 5.6 볼록성 증명

- **정의로 보이기.** $f(x)=\|x\|$: 삼각부등식과 $\|cx\|=|c|\,\|x\|$로 $\|\theta x+(1-\theta)y\|\le\theta\|x\|+(1-\theta)\|y\|$ ($0\le\theta\le1$).
- **헤시안으로 보이기.** $f(x)=x^\top Ax+b^\top x$의 헤시안은 $A+A^\top$이고, 이것이 준정부호면 볼록이다. 예: 최소제곱 $\|y-\Phi\theta\|^2$의 헤시안 $2\Phi^\top\Phi$는 준정부호(5.5절)라 볼록이다.
- **합도 볼록.** $f,g$가 볼록이고 $a,b\ge0$이면 정의의 부등식 두 개에 각각 $a,b$를 곱해 더하면 $af+bg$도 볼록.
- **볼록이면 국소 최소 = 전역 최소.** $x^*$가 국소 최소인데 $f(y)<f(x^*)$인 $y$가 있다고 하자. $z_\theta=\theta y+(1-\theta)x^*$($0<\theta\le1$)에서 $f(z_\theta)\le\theta f(y)+(1-\theta)f(x^*)<f(x^*)$. $\theta\to0$이면 $z_\theta$가 $x^*$에 얼마든지 가까워지는데 값은 더 작다. 국소 최소라는 가정에 모순이다. ∎
- **젠센으로 푸는 확률 부등식.** $f$가 볼록이면 $f(\mathbb E[X])\le\mathbb E[f(X)]$.
  - $x^2$은 볼록 → $(\mathbb E[X])^2\le\mathbb E[X^2]$.
  - $-\log x$는 볼록($(-\log x)''=1/x^2>0$) → $-\log\mathbb E[X]\le-\mathbb E[\log X]$, 즉 $\mathbb E[\log X]\le\log\mathbb E[X]$.
  - 오목 함수는 부등호가 반대다.
- **쌍대 함수는 오목.** 각 $x$마다 $\mathfrak L(x,\lambda)$는 $\lambda$의 일차함수다. $\lambda=\theta\lambda_1+(1-\theta)\lambda_2$를 넣으면 $\mathfrak L(x,\lambda)=\theta\mathfrak L(x,\lambda_1)+(1-\theta)\mathfrak L(x,\lambda_2)\ge\theta\mathfrak D(\lambda_1)+(1-\theta)\mathfrak D(\lambda_2)$. 왼쪽을 $x$에 대해 최소화하면 $\mathfrak D(\lambda)\ge\theta\mathfrak D(\lambda_1)+(1-\theta)\mathfrak D(\lambda_2)$. ∎

### 5.7 약쌍대성 $d^*\le p^*$

조건을 지키는 아무 $x$와 아무 $\lambda\ge0$을 잡는다.

$$
\begin{aligned}
\mathfrak D(\lambda)&=\min_{x'}\mathfrak L(x',\lambda)\le\mathfrak L(x,\lambda)\\
&=f(x)+\textstyle\sum_i\lambda_ig_i(x)\le f(x)
\end{aligned}
$$

마지막 부등호는 $\lambda_i\ge0$, $g_i(x)\le0$이라 합이 0 이하라서다. 오른쪽에서 조건을 지키는 $x$에 대해 최소를 취하면 $\mathfrak D(\lambda)\le p^*$, 왼쪽에서 $\lambda\ge0$에 대해 최대를 취하면 $d^*\le p^*$. ∎

### 5.8 가우시안 잡음 MLE = 최소제곱, 가우시안 사전 MAP = 릿지

1. $y_n\sim\mathcal N(f(x_n,\theta),\sigma^2)$이면 $-\log p(y_n\mid x_n,\theta)=\frac{(y_n-f(x_n,\theta))^2}{2\sigma^2}+\frac12\log(2\pi\sigma^2)$.
2. $n$에 대해 더하면 $\frac1{2\sigma^2}\sum_n(y_n-f(x_n,\theta))^2+\frac N2\log(2\pi\sigma^2)$. 둘째 항은 $\theta$와 무관하고 $\frac1{2\sigma^2}>0$이므로 최소점은 제곱합의 최소점과 같다.
3. MAP는 $-\log p(\theta)$를 더한다. $p(\theta)=\mathcal N(0,b^2I)$이면 $-\log p(\theta)=\frac1{2b^2}\|\theta\|^2+\text{상수}$.
4. 전체에 $2\sigma^2$를 곱하면(최소점은 같다) $\sum_n(y_n-f)^2+\frac{\sigma^2}{b^2}\|\theta\|^2$, 즉 $\lambda=\sigma^2/b^2$인 L2 정규화다.

### 5.9 정규방정식, 릿지, 베이즈 회귀

- **정규방정식.** $\frac{d}{d\theta}\|y-\Phi\theta\|^2=-2(y-\Phi\theta)^\top\Phi=0^\top$. 전치하면 $\Phi^\top\Phi\theta=\Phi^\top y$.
- **잡음 분산.** $\mathcal L=\frac N2\log\sigma^2+\frac{S}{2\sigma^2}+\text{상수}$, $S=\|y-\Phi\theta_{\text{ML}}\|^2$. $\sigma^2$로 미분하면 $\frac N{2\sigma^2}-\frac S{2\sigma^4}=0$ → $\sigma^2=\frac SN$.
- **릿지.** $\|y-\Phi\theta\|^2+\lambda\|\theta\|^2$의 미분에 $2\lambda\theta^\top$이 더해져 $(\Phi^\top\Phi+\lambda I)\theta=\Phi^\top y$. $v\ne0$이면 $v^\top(\Phi^\top\Phi+\lambda I)v=\|\Phi v\|^2+\lambda\|v\|^2>0$이라 역행렬이 언제나 있다.
- **베이즈 사후분포.** 로그 사후 $=-\frac1{2\sigma^2}\|y-\Phi\theta\|^2-\frac12(\theta-m_0)^\top S_0^{-1}(\theta-m_0)+\text{상수}$. 전개해 $\theta$의 2차 항과 1차 항만 모으면 $-\frac12\theta^\top(\sigma^{-2}\Phi^\top\Phi+S_0^{-1})\theta+\theta^\top(\sigma^{-2}\Phi^\top y+S_0^{-1}m_0)$. 가우시안의 로그 $-\frac12\theta^\top S_N^{-1}\theta+\theta^\top S_N^{-1}m_N$과 계수를 맞추면 $S_N^{-1}=S_0^{-1}+\sigma^{-2}\Phi^\top\Phi$, $S_N^{-1}m_N=S_0^{-1}m_0+\sigma^{-2}\Phi^\top y$.
- **예측분포.** $\phi_*^\top\theta\sim\mathcal N(\phi_*^\top m_N,\ \phi_*^\top S_N\phi_*)$ (6장 선형변환). 독립인 잡음 $\epsilon$을 더하면 분산에 $\sigma^2$이 더해진다.

### 5.10 PCA: 분산 최대화 → 고유벡터

1. 중심화된 데이터에서 방향 $b$의 좌표 분산은 $\frac1N\sum_n(b^\top x_n)^2=b^\top\big(\frac1N\sum_nx_nx_n^\top\big)b=b^\top Sb$.
2. $b$를 늘리면 분산이 끝없이 커지므로 $b^\top b=1$로 묶는다. 라그랑지안 $b^\top Sb+\lambda(1-b^\top b)$.
3. $b$로 미분: $2b^\top S-2\lambda b^\top=0$ ($S$ 대칭). 전치하면 $Sb=\lambda b$.
4. 이때 분산은 $b^\top Sb=\lambda b^\top b=\lambda$이므로 가장 큰 고유값의 고유벡터를 고른다. 이미 고른 방향과 직교하는 조건을 더해 반복하면 $m$번째 방향은 $m$번째로 큰 고유값의 고유벡터다.
5. 재구성 오차: 고유벡터 전체로 $x_n=\sum_d(b_d^\top x_n)b_d$라 쓰면 $x_n-\tilde x_n=\sum_{j>M}(b_j^\top x_n)b_j$이고, 정규직교라 $\|x_n-\tilde x_n\|^2=\sum_{j>M}(b_j^\top x_n)^2$. 평균을 내면 $\sum_{j>M}b_j^\top Sb_j=\sum_{j>M}\lambda_j$.

### 5.11 GMM 갱신식

- **평균.** $\frac{\partial}{\partial\mu_k}\log\sum_j\pi_j\mathcal N_j$는 합 중 $j=k$ 항만 남는다. 가우시안의 미분 $\frac{\partial}{\partial\mu_k}\mathcal N(x_n\mid\mu_k,\Sigma_k)=\mathcal N(x_n\mid\mu_k,\Sigma_k)(x_n-\mu_k)^\top\Sigma_k^{-1}$을 넣으면 분수 부분이 정확히 $r_{nk}$가 되어

$$
\frac{\partial\mathcal L}{\partial\mu_k}=\sum_nr_{nk}(x_n-\mu_k)^\top\Sigma_k^{-1}=0^\top
$$

오른쪽에 $\Sigma_k$를 곱하면 $\sum_nr_{nk}x_n=N_k\mu_k$, 그래서 $\mu_k=\frac1{N_k}\sum_nr_{nk}x_n$. $r_{nk}$도 $\mu_k$에 의존하므로 닫힌 해가 아니다. 그래서 E·M 단계를 번갈아 반복한다.
- **비율.** 조건 $\sum_k\pi_k=1$이 있어 $\mathcal L+\lambda(\sum_k\pi_k-1)$을 쓴다.
  1. $\frac{\partial\mathcal L}{\partial\pi_k}=\sum_n\frac{\mathcal N(x_n\mid\mu_k,\Sigma_k)}{\sum_j\pi_j\mathcal N_j}=\frac{N_k}{\pi_k}$ (분자·분모에 $\pi_k$를 곱해 $r_{nk}$ 모양을 만든다).
  2. $\frac{N_k}{\pi_k}+\lambda=0$ → $\pi_k=-\frac{N_k}\lambda$.
  3. $k$에 대해 더하면 $1=-\frac N\lambda$ → $\lambda=-N$ → $\pi_k=\frac{N_k}N$.

### 5.12 SVM: 마진과 쌍대

1. **거리.** 점 $x_a$의 수선의 발을 $x_a'$이라 하면 $x_a=x_a'+r\frac{w}{\|w\|}$. 양변에 $\langle w,\cdot\rangle+b$를 적용하면 $\langle w,x_a\rangle+b=0+r\|w\|$ → $r=\frac{\langle w,x_a\rangle+b}{\|w\|}$.
2. **마진.** $(w,b)$와 $(cw,cb)$는 같은 초평면이라 가장 가까운 점에서 $y_nf(x_n)=1$로 맞출 수 있다. 그러면 마진은 $\frac1{\|w\|}$이고, 이를 최대화하는 것은 $\frac12\|w\|^2$를 최소화하는 것과 같다.
3. **라그랑지안**(소프트 마진, $\alpha_n,\gamma_n\ge0$, $f_n=\langle w,x_n\rangle+b$):

$$
\begin{aligned}
\mathfrak L={}&\tfrac12\|w\|^2+C\textstyle\sum_n\xi_n\\
&-\textstyle\sum_n\gamma_n\xi_n\\
&-\textstyle\sum_n\alpha_n(y_nf_n-1+\xi_n)
\end{aligned}
$$

4. **미분해서 0.** $w$: $w=\sum_n\alpha_ny_nx_n$. $b$: $\sum_n\alpha_ny_n=0$. $\xi_n$: $C-\alpha_n-\gamma_n=0$이고 $\gamma_n\ge0$이라 $\alpha_n\le C$.
5. **대입.** $\frac12\|w\|^2=\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle$이고 $-\sum_n\alpha_ny_n\langle w,x_n\rangle=-\sum_{i,j}\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle$이다. $b$ 항은 4의 둘째 식으로 0, $\xi$ 항은 4의 셋째 식으로 0, 상수 항 $\sum_n\alpha_n$은 그대로 남는다. 합치면 $\mathfrak D(\alpha)=\sum_i\alpha_i-\frac12\sum_{i,j}\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle$. 부호를 바꿔 최소화하면 (12.41)이다.

## 6. 서술형 답 한두 문장

- **MLE·MAP·베이즈의 차이.** MLE는 가능도를 최대로 하는 매개변수 하나를 고른다. MAP는 사전분포를 곱해 최대로 하는 하나를 고르며 정규화와 같다. 베이즈 추론은 하나를 고르지 않고 사후분포 전체로 예측을 평균해 불확실성까지 낸다.
- **회귀 예측이 사영인 이유.** 정규방정식 $\Phi^\top(y-\Phi\theta)=0$은 잔차가 $\Phi$의 모든 열과 직교한다는 뜻이다. 그래서 $\Phi\theta_{\text{ML}}$은 열공간에서 $y$에 가장 가까운 점, 곧 직교 사영이다.
- **PCA·SVD·에카르트-영.** 중심화한 데이터 행렬의 왼쪽 특이벡터가 주성분이고 $\lambda_d=\sigma_d^2/N$이다. 상위 $M$개로 복원한 행렬은 계수 $M$ 이하 행렬 가운데 원래 데이터에 가장 가까워 재구성 오차가 최소다.
- **EM이 필요한 이유.** GMM 로그가능도는 로그 안에 합이 있어, 미분해서 0으로 놓은 식에 매개변수가 서로 얽혀 닫힌 해가 없다. 책임도를 고정하면 각 갱신이 닫힌 꼴이 되므로 둘을 번갈아 계산한다.
- **GMM과 K-평균.** GMM은 책임도로 부드럽게 배정하고 평균·공분산·비율을 모두 배운다. K-평균은 가장 가까운 중심에 딱 잘라 배정하고 평균만 갱신한다. 둘 다 국소 최적이고 초기값에 민감하다.
- **SVM 쌍대와 커널의 쓸모.** 쌍대에서는 데이터가 내적으로만 들어가 커널로 바꿀 수 있다. 특징을 직접 만들지 않고 무한 차원 특징도 쓸 수 있고, 변수 수가 특징 차원이 아니라 데이터 수다. 유효한 커널은 대칭이고 그람 행렬이 늘 준정부호여야 한다.
- **하드·소프트 마진과 $C$.** 하드 마진은 모든 점을 마진 밖에 두라고 요구해 완전히 나뉘는 데이터에만 쓴다. 소프트 마진은 여유 변수로 위반을 허락하고, $C$가 클수록 위반을 강하게 막아 마진이 좁아진다.
- **과적합과 막는 법.** 유연한 모델은 훈련 데이터의 잡음까지 맞춰 훈련 오차는 작지만 새 데이터에서는 나빠진다. 정규화로 매개변수 크기에 벌점을 주고, 교차검증으로 처음 보는 데이터의 성능을 추정한다.
- **중첩 교차검증.** 모델 선택에 쓴 교차검증 점수는 여러 잡음 섞인 추정값 중 가장 좋은 것을 고른 값이라 낙관적이다. 그래서 바깥 고리에서 남겨 둔 조각으로 따로 평가한다.
- **예측 분산의 두 항.** $\phi_*^\top S_N\phi_*$는 매개변수를 확실히 모르는 데서 오고 데이터가 많아지면 줄어든다. $\sigma^2$은 데이터 자체의 잡음이라 줄일 수 없다.

## 7. 영어 지문 용어

| 영어 | 뜻 | 영어 | 뜻 |
|---|---|---|---|
| Show that / Prove | 증명하라 | Derive | 식을 끝까지 유도하라 |
| Compute / Evaluate | 값을 계산하라 | Verify / Check | 확인하라 |
| Justify | 이유를 대라 | Classify | 종류를 판정하라 |
| subspace | 부분공간 | basis / dimension | 기저 / 차원 |
| rank, kernel(null space), image | 랭크, 핵(영공간), 상 | transformation matrix | 변환 행렬 |
| orthogonal projection | 정사영 | orthogonal complement | 직교여공간 |
| inner product | 내적 | positive (semi)definite | 양의 (준)정부호 |
| eigenvalue / eigenvector | 고유값 / 고유벡터 | singular value | 특이값 |
| gradient / Jacobian / Hessian | 기울기 / 야코비안 / 헤시안 | stationary point / saddle point | 정류점 / 안장점 |
| step size (learning rate) | 학습률 | convex / concave | 볼록 / 오목 |
| Lagrangian / dual function | 라그랑지안 / 쌍대 함수 | strong duality | 강한 쌍대성 |
| complementary slackness | 상보 여유성 | i.i.d. | 독립이고 같은 분포 |
| likelihood / prior / posterior | 가능도 / 사전분포 / 사후분포 | conjugate prior | 켤레 사전분포 |
| marginal likelihood (evidence) | 주변 가능도 | posterior predictive | 사후 예측 분포 |
| change of variables | 변수 변환 | empirical risk | 경험적 위험 |
| overfitting / regularization | 과적합 / 정규화 | cross-validation (nested) | (중첩) 교차검증 |
| d-separation / collider | d-분리 / 충돌 노드 | latent variable | 잠재변수 |
| responsibility | 책임도 | mixture weight | 혼합 비율 |
| reconstruction error | 재구성 오차 | explained variance | 설명된 분산 |
| margin / support vector | 마진 / 서포트 벡터 | slack variable | 여유 변수 |
| hinge loss | 힌지 손실 | Gram matrix | 그람 행렬 |

## 8. 입실 직전 마지막 10분

소리 내어 한 번씩 읽는다.

1. 기울기는 행벡터다. 경사하강법에는 전치를 붙인다.
2. $x^\top Bx$의 미분이 $2x^\top B$인 것은 $B$가 대칭일 때뿐이다.
3. 2차 테일러 근사의 헤시안 항에는 $\frac12$이 붙는다.
4. 공분산 분모는 $N$. PCA는 평균부터 빼고, 복원할 때 평균을 다시 더한다.
5. 가우시안 조건부 분산은 관측값과 무관하고 원래 분산보다 작다.
6. 사영은 오차가 기저와 직교한다는 조건에서 나온다: $B^\top(x-B\lambda)=0$.
7. SVD는 $u_i=Av_i/\sigma_i$로 부호를 맞춘다.
8. MAP의 $\lambda$는 $\sigma^2/b^2$(잡음 분산 ÷ 사전 분산)이다.
9. 베이즈 예측 분산에는 마지막에 $\sigma^2$을 더한다.
10. PCA 재구성 오차는 **버린** 고유값의 합이다.
11. GMM 공분산 갱신에는 새 평균을 쓰고, $\pi_k=N_k/N$이다.
12. 라그랑지안은 조건을 $g\le0$ 꼴로 맞춘 뒤 $+\lambda g$를 붙인다. 약쌍대성은 언제나, 강쌍대성은 볼록 문제에서.
13. 충돌 노드는 "알면 열림", 사슬·갈래는 "알면 막힘".
14. SVM: 마진 $\frac1{\|w\|}$, 쌍대 조건 $\sum_n\alpha_ny_n=0$과 $0\le\alpha_n\le C$, $b$는 $0<\alpha_n<C$인 점에서 구한다.
15. 막히면 넘어가고, 못 끝낸 문제에도 출발 식은 남긴다.
