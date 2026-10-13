---
title: "MML 12장 SVM: 마진, 쌍대 문제, 커널"
slug: "mml-ch12-svm"
date: 2026-10-12
weight: 12
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "SVM", "라그랑주 쌍대", "커널"]
description: "MML 12장(교재 370~394쪽) 해설. 분리 초평면과 마진 유도, 하드·소프트 마진, 힌지 손실, 라그랑주 쌍대 문제와 3점 손계산, 커널을 정리했다."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재 쪽수**: 370~394쪽 (Chapter 12)  
> **교재 밖 보충:** 교재에 없는 내용(Cover 정리, Pegasos, SMO, Platt 식)은 "교재 밖 보충"으로 표시했다.  
> **선수 지식 및 연계**: 2장 선형대수학(아핀 부분공간으로서의 초평면), 3장 해석기하학(내적, 직교 사영, 거리 계산), 7장 연속 최적화(라그랑주 승수법, KKT 최적성 조건, 라그랑주 쌍대성, 2차 계획법 QP), 8장 모델과 데이터(경험적 위험 최소화 ERM, $\ell_2$ 정규화, 교차검증).  
> **후속 및 의의**: 9장(회귀)의 확률적·우도 기반 접근법과 달리, 기하학적 직관(마진 최대화)과 손실 함수 관점(힌지 손실 + 정규화)을 함께 쓰는 지도학습 방법입니다. 재생 커널 힐베르트 공간(RKHS)을 통한 비선형 확장(커널 트릭)을 완성합니다.

---

## 0. 이 장 지도

12장은 머신러닝의 가장 핵심적인 지도학습 분류 알고리즘인 **서포트 벡터 머신(Support Vector Machine, SVM)**\ 을 기하학, 최적화 이론, 함수해석학(커널)의 세 가지 시선에서 완전히 분해하고 통합합니다. 

### [절 목록 및 핵심 요약]
- **12.1 분리 초평면(Separating Hyperplanes, 372~373쪽) [중요도: ★★★]**: 초평면(hyperplane)의 방정식 $\langle w, x \rangle + b = 0$, 법선 벡터(normal vector) $w$의 기하학적 의미, 이진 분류 결정 규칙.
- **12.2 원시 서포트 벡터 머신(Primal Support Vector Machine, 374~383쪽) [중요도: ★★★]**: 기하학적 마진 정의에서 하드 마진 및 소프트 마진 원시 최적화 문제로의 정식화.
  - **12.2.1 마진의 개념(Concept of the Margin, 374~376쪽)**: 점과 초평면 사이의 직교 사영 거리 $r$ 유도 및 단위 법선 벡터 정규화($\|w\|=1$).
  - **12.2.2 마진의 전통적 유도(Traditional Derivation of the Margin, 376~378쪽)**: 초평면 스케일 고정($\langle w, x_a \rangle + b = 1$)을 통한 마진 $r = 1/\|w\|$ 도출.
  - **12.2.3 마진을 1로 둘 수 있는 이유(Why We Can Set the Margin to 1, 378~379쪽) [Theorem 12.1]**: 스케일 불변성(scale invariance)을 이용해 $\max r$과 $\min \frac{1}{2}\|w\|^2$의 엄밀한 수학적 동치성 증명.
  - **12.2.4 소프트 마진 SVM: 기하학적 관점(Soft Margin SVM: Geometric View, 379~380쪽)**: 선형 분리 불가능 데이터를 위한 슬랙 변수(slack variable) $\xi_n$ 도입과 정규화 매개변수 $C$.
  - **12.2.5 소프트 마진 SVM: 손실 함수 관점(Soft Margin SVM: Loss Function View, 380~383쪽)**: 힌지 손실(hinge loss)과 $\ell_2$ 정규화의 합으로 표현되는 비제약 최적화 문제 정식화 및 등가성 증명.
- **12.3 쌍대 서포트 벡터 머신(Dual Support Vector Machine, 383~388쪽) [중요도: ★★★]**: 라그랑주 쌍대성을 통한 고차원/무한차원 확장 기반 마련.
  - **12.3.1 라그랑주 승수를 통한 볼록 쌍대성(Convex Duality via Lagrange Multipliers, 383~386쪽)**: 원시 문제에서 쌍대 문제로의 완전한 수학적 유도, 표현자 정리(Representer Theorem), 박스 제약조건($0 \le \alpha_n \le C$).
  - **12.3.2 쌍대 SVM: 볼록 껍질 관점(Dual SVM: Convex Hull View, 386~388쪽)**: 양성 클래스와 음성 클래스의 볼록 껍질(convex hull) 간의 최단 거리 문제로서의 SVM 기하학적 재해석.
- **12.4 커널(Kernels, 388~390쪽) [중요도: ★★★]**: 내적의 일반화, 재생 커널 힐베르트 공간(RKHS), 그람 행렬(Gram matrix), 커널 트릭(Kernel Trick)을 통한 비선형 경계면 형성.
- **12.5 수치적 해법(Numerical Solution, 390~392쪽) [중요도: ★★☆]**: 힌지 손실의 서브그레디언트(subgradient) 최적화 및 2차 계획법(QP, Quadratic Programming) 표준형 변환.
- **12.6 더 읽을거리(Further Reading, 392~394쪽) [중요도: ★★☆]**: 로지스틱 회귀(확률적 분류)와의 비교, 플랫 스케일링(Platt scaling), 르장드르-펜첼 변환(Fenchel conjugate) 관점.

### [개념 간 의존 관계]
```
[12.1 분리 초평면: <w, x> + b = 0, 법선벡터 w]
         │
         ▼
[12.2.1~12.2.3 직교 사영 거리 r = 1/||w||] ──▶ [하드 마진 원시 문제: min 1/2 ||w||^2]
         │
         ├──▶ [12.2.4 슬랙 변수 ξ_n 도입] ──┐
         │                                   ├──▶ [소프트 마진 원시 문제 (C-SVM)]
         └──▶ [12.2.5 힌지 손실 관점] ───────┘
                                                       │
         ┌─────────────────────────────────────────────┘
         ▼
[12.3.1 라그랑주 승수법 (α, γ)]
         │
         ├──▶ [KKT 정지조건: w = Σ α_n y_n x_n (표현자 정리)]
         ├──▶ [편향 조건: Σ α_n y_n = 0]
         │
         ▼
[12.3.1 쌍대 SVM (Dual QP): 내적 <x_i, x_j>만으로 표현] ◀── [12.3.2 볼록 껍질 최단거리 동치]
         │
         ▼
[12.4 커널 트릭: <x_i, x_j> ──▶ k(x_i, x_j)]
         │
         ▼
[12.5 수치 해법: 서브그레디언트 vs 2차 계획법(QP)]
```

---

## 12.1 분리 초평면(Separating Hyperplanes, 372~373쪽)

### 왜 필요한가 (직관)
이진 분류(binary classification)는 $D$차원 특성 공간에 흩어져 있는 데이터들을 $+1$과 $-1$의 두 그룹으로 쪼개는 경계면을 찾는 문제입니다. 가장 단순하면서도 수학적으로 아름다운 경계면은 직선, 평면, 그리고 이를 $D$차원으로 확장한 **초평면(hyperplane)**\ 입니다.

2차원 종이 위에 빨간 점들과 파란 점들이 있을 때, 그 사이를 자르는 직선을 그리는 것을 상상해 보십시오. 초평면은 바로 그 직선의 다차원 일반화입니다.

### 정의와 성질

#### 1. 분리 초평면의 방정식
$w \in \mathbb{R}^D$를 가중치 벡터(weight vector), $b \in \mathbb{R}$을 편향(bias, 절편)이라 할 때, 선형 함수 $f: \mathbb{R}^D \to \mathbb{R}$를 다음과 같이 정의합니다 (교재 식 12.2):

$$f(x) := \langle w, x \rangle + b = w^\top x + b$$

이때 초평면은 $f(x) = 0$을 만족하는 점들의 집합인 아핀 부분공간(affine subspace)입니다 (교재 식 12.3):

$$\{x \in \mathbb{R}^D : \langle w, x \rangle + b = 0\}$$

#### 2. 법선 벡터 $w$의 기하학적 성질 (직교성 증명)
초평면 위에 있는 임의의 두 점 $x_a, x_b$를 잡습니다 ($f(x_a) = 0, f(x_b) = 0$).
두 점을 잇는 방향 벡터 $x_a - x_b$와 벡터 $w$의 내적을 계산해 보면 (교재 식 12.4):

$$\begin{aligned} f(x_a) - f(x_b) &= (\langle w, x_a \rangle + b) \\ &\quad - (\langle w, x_b \rangle + b) \\ &= \langle w, x_a - x_b \rangle \end{aligned}$$

좌변이 $0 - 0 = 0$이므로:
$$\langle w, x_a - x_b \rangle = 0$$

내적이 $0$이라는 것은 두 벡터가 직교(orthogonal)함을 의미합니다. 따라서 **$w$는 초평면 위의 모든 선분과 수직인 법선 벡터(normal vector)**\ 입니다!

#### 3. 분류 결정 규칙 (Decision Rule)
초평면은 전체 공간을 두 개의 반공간(half-space)으로 분할합니다:
- 양의 영역: $\langle w, x \rangle + b \ge 0 \implies \hat{y} = +1$
- 음의 영역: $\langle w, x \rangle + b < 0 \implies \hat{y} = -1$

학습 데이터 $(x_n, y_n)$ ($n=1, \dots, N$)이 모두 올바르게 분류된다는 조건은 다음 두 식으로 나타낼 수 있습니다:
- $y_n = +1$일 때: $\langle w, x_n \rangle + b \ge 0$
- $y_n = -1$일 때: $\langle w, x_n \rangle + b < 0$

양변에 $y_n$을 곱해주면, 부호가 일치하므로 단 하나의 우아한 부등식으로 합쳐집니다 (교재 식 12.7):

$$y_n (\langle w, x_n \rangle + b) \ge 0 \quad (\forall n = 1, \dots, N)$$

### 손으로 풀어 보는 예제 (초평면 방정식)
2차원 평면에서 법선 벡터 $w = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$, 편향 $b = -4$인 초평면이 주어졌다고 하자.
1. 이 초평면의 방정식: $2x_1 + x_2 - 4 = 0 \iff x_2 = -2x_1 + 4$ (기울기 $-2$, $x_2$절편 $4$인 직선).
2. 점 $A = \begin{bmatrix} 3 \\ 1 \end{bmatrix}$의 분류:
   $$f(A) = 2(3) + 1(1) - 4 = 6 + 1 - 4 = +3 > 0 \implies \hat{y} = +1$$
3. 점 $B = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$의 분류:
   $$f(B) = 2(1) + 1(1) - 4 = 2 + 1 - 4 = -1 < 0 \implies \hat{y} = -1$$

### 헷갈리는 점 / 자주 하는 실수
- **기하학적 벡터 vs 좌표 벡터**: 
  - $w$는 초평면의 '방향'을 가리키는 법선 화살표(geometric vector)입니다.
  - $x$는 데이터 공간의 '위치'를 나타내는 점(coordinate vector)입니다.
- **편향 $b$의 역할**: $b$는 초평면이 원점에서 얼마나 떨어져 있는지를 결정합니다. $b=0$이면 초평면은 반드시 원점을 지납니다.

---

## 12.2 원시 서포트 벡터 머신(Primal Support Vector Machine, 374~383쪽)

### 왜 필요한가 (직관)
데이터가 정확히 선형 분리 가능(linearly separable)할 때, 두 클래스를 나누는 초평면은 단 하나만 존재하는 것이 아니라 **무한히 많이 존재**합니다 (교재 그림 12.3).
어떤 초평면은 빨간 점에 너무 바짝 붙어 있고, 어떤 것은 파란 점에 너무 바짝 붙어 있습니다. 이렇게 데이터에 아슬아슬하게 붙어 있는 경계선은 새로운 테스트 데이터가 조금만 노이즈를 띠고 들어와도 잘못 분류할 위험(일반화 오차, generalization error)이 큽니다.

그렇다면 무한히 많은 후보 중에서 **가장 훌륭한 단 하나의 초평면**은 무엇일까요?
바로 **"두 클래스의 데이터로부터 가장 멀리 떨어져서, 양쪽으로 가장 넓은 안전거리(여백, Margin)를 확보한 초평면"**\ 입니다! 이것이 서포트 벡터 머신의 대원칙인 **마진 최대화(Margin Maximization)**\ 입니다.

---

### 12.2.1 마진의 개념(Concept of the Margin, 374~376쪽)

#### 직교 사영을 이용한 거리 $r$의 유도
초평면의 양의 영역에 있는 데이터 포인트 $x_a$ ($\langle w, x_a \rangle + b > 0$)를 생각합니다 (교재 그림 12.4).
$x_a$에서 초평면에 내린 수선의 발(직교 사영, orthogonal projection)을 $x_a'$라 합시다.
$x_a'$는 초평면 위의 점이므로 다음을 만족합니다:
$$\langle w, x_a' \rangle + b = 0$$

수선의 방향은 법선 벡터 $w$와 나란하므로, 단위 법선 벡터 $\frac{w}{\|w\|}$에 거리 $r > 0$을 곱한 벡터만큼 이동한 것이 $x_a$입니다 (교재 식 12.8):

$$x_a = x_a' + r \frac{w}{\|w\|}$$

이 식을 초평면 방정식에 대입하면:
$$\begin{aligned} \langle w, x_a \rangle + b &= \left\langle w, x_a' + r \frac{w}{\|w\|} \right\rangle + b \\ &= \underbrace{\langle w, x_a' \rangle + b}_{=0} + r \frac{\langle w, w \rangle}{\|w\|} \\ &= r \frac{\|w\|^2}{\|w\|} = r \|w\| \end{aligned}$$

따라서 임의의 점 $x_a$와 초평면 사이의 기하학적 수직 거리는:
$$r = \frac{\langle w, x_a \rangle + b}{\|w\|}$$
음의 영역에 있는 점까지 포괄하여 일반화하면, 데이터 $x_n$과 초평면 사이의 거리는:
$$\text{dist}(x_n, \text{hyperplane}) = \frac{y_n (\langle w, x_n \rangle + b)}{\|w\|}$$

**마진(Margin)**\ 은 초평면에서 가장 가까운 데이터 포인트까지의 거리입니다. 만약 법선 벡터를 단위 길이($\|w\|=1$)로 고정한다면, 모든 데이터가 초평면으로부터 최소한 거리 $r$ 이상 떨어져 있어야 하므로 다음과 같은 최적화 문제가 됩니다 (교재 식 12.10):

$$\begin{aligned} \max_{w, b, r} \quad & r \\ \text{subject to} \quad & y_n (\langle w, x_n \rangle + b) \ge r, \\ &\quad \forall n=1, \dots, N \\ & \|w\| = 1, \quad r > 0 \end{aligned}$$

---

### 12.2.2 마진의 전통적 유도(Traditional Derivation of the Margin, 376~378쪽)

위의 정규화 조건 $\|w\|=1$ 대신, 머신러닝 문헌(Vapnik, Schölkopf 등)에서 전통적으로 사용하는 정규화 방식은 **데이터 스케일을 고정**하는 것입니다.

초평면에 가장 가까운 점 $x_a$에서의 함수값을 정확히 $1$로 스케일링합니다:
$$\langle w, x_a \rangle + b = 1$$
이 점 $x_a$의 직교 사영 $x_a'$는 초평면 위에 있으므로 $\langle w, x_a' \rangle + b = 0$ 입니다.
벡터 덧셈 $x_a = x_a' + r \frac{w}{\|w\|}$를 내적에 대입하면 (교재 식 12.12, 12.13):
$$\begin{gathered} \langle w, x_a \rangle + b - \left\langle w, r \frac{w}{\|w\|} \right\rangle = 0 \\ \implies 1 - r \|w\| = 0 \end{gathered}$$

따라서 **마진 $r$은 법선 벡터의 노름의 역수**가 됩니다 (교재 식 12.14):

$$r = \frac{1}{\|w\|}$$

이것은 매우 중요한 통찰을 줍니다:
- **마진 $r = \frac{1}{\|w\|}$을 최대화하는 것 $\iff$ 법선 벡터의 길이 $\|w\|$를 최소화하는 것!**

계산의 편의를 위해 2차 형식과 상수 $\frac{1}{2}$을 도입하면, **하드 마진 SVM(Hard Margin SVM)**\ 의 원시 최적화 문제가 완성됩니다 (교재 식 12.18, 12.19):

$$\begin{aligned} \min_{w, b} \quad & \frac{1}{2} \|w\|^2 \\ \text{subject to} \quad & y_n (\langle w, x_n \rangle + b) \ge 1, \\ &\quad \forall n = 1, \dots, N \end{aligned}$$

---

### 12.2.3 마진을 1로 둘 수 있는 이유 (Theorem 12.1, 378~379쪽)

초심자들이 가장 의아해하는 질문: **"왜 마진 경계선에서의 함수값을 임의로 1이라고 놓아도 일반성을 잃지 않는가? 2나 0.5로 두면 안 되는가?"**

#### 정리 12.1의 엄밀한 증명
- 12.2.1절의 문제: $$\begin{aligned} \max_{w, b, r} r^2 \\ \text{s.t.} \quad & y_n \left( \left\langle \frac{w}{\|w\|}, x_n \right\rangle + b \right) \ge r, \\ & r > 0 \end{aligned}$$.
- 선형 제약조건의 양변을 $r > 0$으로 나눕니다:
  $$y_n \left( \left\langle \frac{w}{r \|w\|}, x_n \right\rangle + \frac{b}{r} \right) \ge 1$$
- 새로운 변수를 정의합니다:
  $$w'' := \frac{w}{r \|w\|}, \quad b'' := \frac{b}{r}$$
- 양변의 노름을 취하면:
  $$\|w''\| = \left\| \frac{w}{r \|w\|} \right\| = \frac{1}{r} \frac{\|w\|}{\|w\|} = \frac{1}{r} \implies r = \frac{1}{\|w''\|} \implies r^2 = \frac{1}{\|w''\|^2}$$
- 따라서 원래의 목적함수 $\max r^2$는:
  $$\max \frac{1}{\|w''\|^2} \iff \min \|w''\|^2 \iff \min \frac{1}{2} \|w''\|^2$$
- 제약조건은 $y_n (\langle w'', x_n \rangle + b'') \ge 1$이 됩니다.
- **결론**: 초평면 방정식 $w^\top x + b = 0$은 0이 아닌 임의의 양수 상수를 곱해도 초평면 자체는 전혀 변하지 않는 **스케일 불변성(scale invariance)**\ 을 갖습니다. 따라서 가장 가까운 데이터에서의 값을 $1$로 고정하는 것은 좌표계의 게이지(gauge)를 하나 선택하는 것일 뿐, 최적의 초평면 기하학적 형태에는 아무런 제약을 주지 않습니다! $\blacksquare$

---

### 12.2.4 소프트 마진 SVM: 기하학적 관점 (379~380쪽)

현실의 데이터는 노이즈가 섞여 있거나, 두 클래스가 서로 약간 겹쳐 있어서 어떤 직선으로도 정확히 둘로 쪼갤 수 없는 **선형 분리 불가능(linearly non-separable)**\ 인 경우가 대부분입니다 (교재 그림 12.6(b)). 하드 마진 SVM은 단 하나의 이상치(outlier)만 있어도 조건을 만족하는 해가 아예 존재하지 않는 치명적 취약점을 가집니다.

이를 해결하기 위해 각 데이터 포인트마다 마진 조건을 위반하는 것을 허용하는 **슬랙 변수(slack variable, 여유 변수)** $\xi_n \ge 0$을 도입합니다 (교재 그림 12.7).

- 마진 조건 완화: $y_n (\langle w, x_n \rangle + b) \ge 1 - \xi_n$
  - $\xi_n = 0$: 데이터가 올바른 마진 바깥에 안전하게 위치함 (위반 없음).
  - $0 < \xi_n \le 1$: 데이터가 올바른 방향에 있지만 마진 안쪽으로 침범함.
  - $\xi_n > 1$: 데이터가 경계면을 넘어 반대편으로 넘어가 오분류(misclassification)됨.

우리는 마진을 넓히고 싶으면서도($\frac{1}{2}\|w\|^2$ 최소화), 동시에 슬랙 변수들의 총합($\sum \xi_n$)을 최소화하여 오분류를 줄이고 싶습니다. 두 목표를 절충(trade-off)하는 매개변수 $C > 0$을 도입한 것이 **소프트 마진 SVM(Soft Margin SVM / C-SVM)**\ 입니다 (교재 식 12.26):

$$\begin{aligned} \min_{w, b, \xi} \quad & \frac{1}{2} \|w\|^2 + C \sum_{n=1}^N \xi_n \\ \text{subject to} \quad & y_n (\langle w, x_n \rangle + b) \ge 1 - \xi_n, \\ &\quad \forall n = 1, \dots, N \\ & \xi_n \ge 0, \quad \forall n = 1, \dots, N \end{aligned}$$

- **정규화 매개변수 $C$의 역할**:
  - $C \to \infty$: 슬랙을 전혀 용납하지 않음 $\implies$ 하드 마진 SVM으로 수렴. 과적합(overfitting) 위험 증가.
  - $C$가 작을 때: 마진을 넓히는 데 더 집중함. 더 많은 이상치와 오분류를 허용하여 마진이 넓어짐. 과소적합(underfitting) 위험.

---

### 12.2.5 소프트 마진 SVM: 손실 함수 관점 (380~383쪽)

머신러닝의 8장에서 배운 **경험적 위험 최소화(Empirical Risk Minimization, ERM)** 프레임워크를 떠올려 봅시다:
$$\begin{aligned} \min_{\text{model}} \quad & \text{규제항(Regularizer)} \\ &\quad + C \times \text{손실함수(Loss)} \end{aligned}$$

이진 분류에서 가장 이상적인 손실 함수는 틀린 개수를 세는 **0-1 손실(zero-one loss)** $\mathbf{1}(y \ne \text{sign}(f(x)))$ 입니다. 하지만 0-1 손실은 불연속이고 미분이 불가능하여 조합 최적화(combinatorial optimization) 문제로 귀결되므로 풀기가 매우 어렵습니다.

SVM은 0-1 손실의 볼록 상한(convex upper bound)인 **힌지 손실(hinge loss)**\ 을 채택합니다 (교재 식 12.28, 그림 12.8):

$$\begin{aligned} \ell_{\text{hinge}}(t) &= \max\{0, 1 - t\}, \\ \text{where } t &= y f(x) = y (\langle w, x \rangle + b) \end{aligned}$$

이 힌지 손실을 전체 데이터에 대해 더하고 $\ell_2$ 규제항 $\frac{1}{2}\|w\|^2$을 더하면, 아무런 제약조건이 없는 **비제약 최적화 문제(unconstrained optimization problem)**\ 가 됩니다 (교재 식 12.31):

$$\begin{aligned} \min_{w, b} \quad & \underbrace{\frac{1}{2} \|w\|^2}_{\text{규제항 (마진 최대화)}} \\ &\quad + C \sum_{n=1}^N \\ &\quad \underbrace{\max\{0, 1 - y_n (\langle w, x_n \rangle + b)\}}_{\text{힌지 손실 (오차 패널티)}} \end{aligned}$$

#### 기하학적 관점과 손실 함수 관점의 동치성 증명
단일 데이터에 대해 힌지 손실의 최소화 문제 $\min_t \max\{0, 1-t\}$를 생각해 봅시다.
보조 변수 $\xi$를 도입하여 $\xi \ge 0$ 이고 $\xi \ge 1-t$ 라는 두 제약조건을 걸면:
$$\begin{aligned} \min \xi \quad \text{s.t.} \quad & \xi \ge 0, \\ & \xi \ge 1 - y_n (\langle w, x_n \rangle + b) \end{aligned}$$
와 정확히 동치입니다 (교재 식 12.32, 12.33). 이를 모든 데이터에 적용하면 정확히 12.2.4절의 슬랙 변수 기반 소프트 마진 최적화 문제 (12.26)로 복원됩니다!

---

### 손으로 풀어 보는 예제 (힌지 손실 계산)
어떤 데이터 3개의 라벨과 예측 함수값 $f(x_n) = \langle w, x_n \rangle + b$가 다음과 같다고 하자:
1. $y_1 = +1, f(x_1) = 1.5$: 마진 경계 바깥에 올바르게 위치.
   $$t_1 = y_1 f(x_1) = 1.5 \implies \ell_1 = \max\{0, 1 - 1.5\} = 0, \quad \xi_1 = 0$$
2. $y_2 = +1, f(x_2) = 0.4$: 올바른 클래스이지만 마진 경계 안으로 침범.
   $$t_2 = y_2 f(x_2) = 0.4 \implies \ell_2 = \max\{0, 1 - 0.4\} = 0.6, \quad \xi_2 = 0.6$$
3. $y_3 = -1, f(x_3) = 0.8$: 잘못 분류됨 (음수여야 하는데 양수값).
   $$t_3 = y_3 f(x_3) = -0.8 \implies \ell_3 = \max\{0, 1 - (-0.8)\} = 1.8, \quad \xi_3 = 1.8$$
총 힌지 손실 합: $\sum_{n=1}^3 \xi_n = 0 + 0.6 + 1.8 = 2.4$.

---

## 12.3 쌍대 서포트 벡터 머신(Dual Support Vector Machine, 383~388쪽)

### 왜 필요한가 (직관)
원시 SVM(Primal SVM)의 결정 변수는 $w \in \mathbb{R}^D$입니다. 즉, 특성의 차원 수 $D$에 비례하여 최적화 변수가 늘어납니다. 만약 데이터의 차원이 수천, 수만 차원이거나 무한 차원이라면 원시 문제는 계산이 불가능해집니다.

하지만 7장에서 배운 **라그랑주 쌍대성(Lagrangian Duality)**\ 을 적용하면 다음과 같이 바뀝니다:
1. 최적화 변수가 $D$차원 벡터 $w$에서 데이터 개수 $N$개의 라그랑주 승수 $\alpha \in \mathbb{R}^N$으로 바뀝니다!
2. 데이터 $x$가 오직 **데이터 쌍 간의 내적 $\langle x_i, x_j \rangle$의 형태**로만 목적함수에 등장합니다!
이 두 가지 특성 덕분에 차원이 아무리 높아도 데이터 개수 $N$만 적당하면 문제를 쉽게 풀 수 있고, 나아가 12.4절의 비선형 **커널 트릭(Kernel Trick)**\ 이 작동할 수 있는 문이 활짝 열립니다.

---

### 12.3.1 라그랑주 승수를 통한 볼록 쌍대성 (383~386쪽)

#### 1. 라그랑지안 함수 구성
원시 문제 (12.26)의 부등식 제약조건에 대해 라그랑주 승수 $\alpha_n \ge 0$과 $\gamma_n \ge 0$을 도입합니다 (교재 식 12.34):

$$\begin{aligned} \mathcal{L}(w, b, \xi, \alpha, \gamma) &= \frac{1}{2} \|w\|^2 \\ &\quad + C \sum_{n=1}^N \xi_n \\ &\quad - \sum_{n=1}^N \alpha_n \Bigl( \\ &\qquad y_n (\langle w, x_n \rangle + b) - 1 + \xi_n \Bigr) \\ &\quad - \sum_{n=1}^N \gamma_n \xi_n \end{aligned}$$

#### 2. 원시 변수에 대한 KKT 정지조건 (Stationarity)
라그랑지안을 세 개의 원시 변수 $w, b, \xi_n$으로 각각 편미분하여 $0$으로 둡니다:

1. **$w$에 대한 편미분** (교재 식 12.35):
   $$\begin{aligned} \nabla_w \mathcal{L} &= w - \sum_{n=1}^N \alpha_n y_n x_n = \mathbf{0} \\ &\implies w = \sum_{n=1}^N \alpha_n y_n x_n \end{aligned}$$
   > **핵심: 표현자 정리(Representer Theorem)**!  
   > 최적의 법선 벡터 $w^*$는 임의의 다른 방향을 가질 수 없으며, **반드시 훈련 데이터 $x_n$들의 선형결합(span) 안에 존재**합니다.

2. **$b$에 대한 편미분** (교재 식 12.36):
   $$\begin{aligned} \frac{\partial \mathcal{L}}{\partial b} &= -\sum_{n=1}^N \alpha_n y_n = 0 \\ &\implies \sum_{n=1}^N \alpha_n y_n = 0 \end{aligned}$$

3. **$\xi_n$에 대한 편미분** (교재 식 12.37):
   $$\begin{aligned} \frac{\partial \mathcal{L}}{\partial \xi_n} &= C - \alpha_n - \gamma_n = 0 \\ &\implies C = \alpha_n + \gamma_n \end{aligned}$$
   라그랑주 승수의 비음수 조건 $\gamma_n \ge 0$에 의해:
   $$\alpha_n \le C$$
   원래의 $\alpha_n \ge 0$과 결합하면 다음과 같은 유명한 **박스 제약조건(Box Constraint)**\ 이 탄생합니다:
   $$0 \le \alpha_n \le C$$

#### 3. 원시 변수 소거 및 쌍대 목적함수 도출
위의 세 관계식을 라그랑지안에 대입하여 $w, b, \xi$를 완전히 소거합니다 (상세 유도는 본문 뒷부분의 '핵심 유도 모음' 참조).
최종적으로 얻어지는 **쌍대 서포트 벡터 머신(Dual SVM)** 문제는 다음과 같습니다 (교재 식 12.41):

$$\begin{aligned} \min_{\alpha} \quad & \frac{1}{2} \sum_{i=1}^N \\ &\quad \sum_{j=1}^N \alpha_i \alpha_j y_i y_j \langle x_i, x_j \rangle \\ &\quad - \sum_{i=1}^N \alpha_i \\ \text{subject to} \quad & \sum_{i=1}^N \alpha_i y_i = 0 \\ & 0 \le \alpha_i \le C, \\ &\quad \forall i = 1, \dots, N \end{aligned}$$

*(참고: 교재에서는 원래 쌍대 함수 $\max_\alpha \mathcal{D}(\alpha)$에 마이너스를 붙여 $\min_\alpha [-\mathcal{D}(\alpha)]$의 최소화 문제로 표준화하였습니다).*

#### 4. 서포트 벡터의 분류와 KKT 상보 여유성 (Complementary Slackness)
KKT 조건 중 상보 여유성 조건은 다음과 같습니다:
1. $\alpha_n [y_n (\langle w, x_n \rangle + b) - 1 + \xi_n] = 0$
2. $\gamma_n \xi_n = (C - \alpha_n) \xi_n = 0$

이 조건에 따라 모든 데이터 포인트는 정확히 세 부류로 나뉩니다:
1. **$\alpha_n = 0$인 점 (비-서포트 벡터)**:
   - $\gamma_n = C > 0 \implies \xi_n = 0$.
   - $y_n (\langle w, x_n \rangle + b) \ge 1$. (대부분은 $> 1$이지만, 마진 경계 위에 있으면서 $\alpha_n = 0$인 점도 있을 수 있다.)
   - 마진 경계선 바깥에 안전하게 있는 대다수의 데이터입니다. $w$를 결정하는 데 아무런 기여도 하지 않습니다!
2. **$0 < \alpha_n < C$인 점 (자유 서포트 벡터 / Free Support Vector)**:
   - $C - \alpha_n > 0 \implies \xi_n = 0$.
   - 따라서 $y_n (\langle w, x_n \rangle + b) = 1$이 정확히 성립합니다!
   - **마진 경계선 바로 위에 정확히 놓여 있는 점**들입니다.
   - 편향 $b^*$를 계산할 때 바로 이 점들을 사용합니다:
     $$\begin{aligned} b^* &= y_n - \langle w^*, x_n \rangle \\ &= y_n - \sum_{j=1}^N \alpha_j^* y_j \langle x_j, x_n \rangle \end{aligned}$$
3. **$\alpha_n = C$인 점 (유계 서포트 벡터 / Bounded Support Vector)**:
   - $\gamma_n = 0 \implies \xi_n \ge 0$.
   - 마진 경계를 침범했거나($0 < \xi_n \le 1$), 반대편으로 넘어가 오분류된($\xi_n > 1$) 데이터들입니다.

---

### 12.3.2 쌍대 SVM: 볼록 껍질 관점 (386~388쪽)

SVM은 라그랑주 승수법 외에도 **계산기하학(computational geometry)** 관점에서 완전히 동일한 문제를 유도할 수 있습니다.

#### 볼록 껍질(Convex Hull)의 정의
어떤 점들의 집합 $X$의 볼록 껍질 $\text{conv}(X)$는 점들의 모든 볼록 결합(가중치 합이 1이고 비음수)으로 둘러싸인 가장 작은 볼록 다포체(convex polytope)입니다 (교재 식 12.43):
$$\begin{aligned} & \text{conv}(X) \\ &= \left\{ \sum_{n=1}^N \alpha_n x_n \ \middle|\ \sum_{n=1}^N \alpha_n = 1, \; \alpha_n \ge 0 \right\} \end{aligned}$$

#### 두 볼록 껍질 사이의 최단 거리
양성 클래스 데이터들의 볼록 껍질을 $\text{conv}(X^+)$, 음성 클래스 데이터들의 볼록 껍질을 $\text{conv}(X^-)$라 합시다 (교재 그림 12.9).
- 양성 껍질 안의 점: $c = \sum_{n: y_n=+1} \alpha_n^+ x_n \quad (\sum \alpha_n^+ = 1, \alpha_n^+ \ge 0)$
- 음성 껍질 안의 점: $d = \sum_{n: y_n=-1} \alpha_n^- x_n \quad (\sum \alpha_n^- = 1, \alpha_n^- \ge 0)$

두 다포체 사이의 가장 가까운 두 점 $c$와 $d$를 찾는 문제는 두 점 사이의 거리 $\|c - d\|^2$를 최소화하는 것입니다 (교재 식 12.48):
$$\begin{aligned} \min_{\alpha^+, \alpha^-} \frac{1}{2} \|c - d\|^2 &= \min \frac{1}{2} \Biggl\| \sum_{n: y_n=+1} \alpha_n^+ x_n \\ &\quad - \sum_{n: y_n=-1} \alpha_n^- x_n \Biggr\|^2 \end{aligned}$$
제약조건 $\sum \alpha_n^+ = 1$과 $\sum \alpha_n^- = 1$을 합치면:
$$\begin{aligned} &\sum_{n: y_n=+1} (+1)\alpha_n^+ \\ &\quad + \sum_{n: y_n=-1} (-1)\alpha_n^- \\ &= 1 - 1 = 0 \\ &\iff \sum_{n=1}^N y_n \alpha_n = 0 \end{aligned}$$
이 기하학적 최소화 문제는 **하드 마진 쌍대 SVM과 수학적으로 정확히 동치**입니다!
최적의 초평면은 바로 두 볼록 껍질 사이의 최단 선분 $c - d$를 수직이등분하는 평면이 됩니다.

---

### 손으로 풀어 보는 예제 (하드 마진 SVM 3개 점 손계산 완전 풀이)
시험장에서 손으로 직접 풀 수 있도록, 해석적으로 깔끔하게 떨어지는 2차원 3점 예제를 단계별로 전개합니다.

**데이터셋 설정**:
- 양성 클래스 ($y = +1$): $x_1 = \begin{bmatrix} 1 \\ 2 \end{bmatrix}, \quad x_2 = \begin{bmatrix} 2 \\ 1 \end{bmatrix}$
- 음성 클래스 ($y = -1$): $x_3 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$

#### 1단계: 내적 행렬(그람 행렬) $K$ 계산
- $K_{11} = x_1^\top x_1 = 1^2 + 2^2 = 5$
- $K_{12} = K_{21} = x_1^\top x_2 = 1(2) + 2(1) = 4$
- $K_{22} = x_2^\top x_2 = 2^2 + 1^2 = 5$
- $x_3$은 원점 $[0, 0]^\top$이므로 다른 모든 점과의 내적이 $0$:
  $K_{13} = K_{31} = 0, \quad K_{23} = K_{32} = 0, \quad K_{33} = 0$

$$K = \begin{bmatrix} 5 & 4 & 0 \\ 4 & 5 & 0 \\ 0 & 0 & 0 \end{bmatrix}$$

#### 2단계: 쌍대 목적함수 구성
쌍대 목적함수:
$$\max_{\alpha_1, \alpha_2, \alpha_3} \sum_{i=1}^3 \alpha_i - \frac{1}{2} \sum_{i=1}^3 \sum_{j=1}^3 \alpha_i \alpha_j y_i y_j K_{ij}$$
제약조건:
$$\begin{aligned} \sum_{i=1}^3 \alpha_i y_i &= \alpha_1(1) + \alpha_2(1) + \alpha_3(-1) = 0 \\ &\implies \alpha_3 = \alpha_1 + \alpha_2 \end{aligned}$$
$\alpha_i \ge 0$.

$\alpha_3 = \alpha_1 + \alpha_2$를 목적함수에 대입합니다:
1. 선형항:
   $$\sum_{i=1}^3 \alpha_i = \alpha_1 + \alpha_2 + \alpha_3 = \alpha_1 + \alpha_2 + (\alpha_1 + \alpha_2) = 2(\alpha_1 + \alpha_2)$$
2. 2차항:
   $x_3$ 관련 내적은 모두 $0$이므로 $i=3$이나 $j=3$인 항은 모두 사라집니다!
   $$\begin{aligned} &\frac{1}{2} \sum_{i=1}^3 \sum_{j=1}^3 \alpha_i \alpha_j y_i y_j K_{ij} \\ &= \frac{1}{2} \Bigl[ \alpha_1^2 (1)(1)(5) \\ &\quad + 2 \alpha_1 \alpha_2 (1)(1)(4) \\ &\quad + \alpha_2^2 (1)(1)(5) \Bigr] \\ &= \frac{1}{2} (5\alpha_1^2 + 8\alpha_1 \alpha_2 + 5\alpha_2^2) \end{aligned}$$

따라서 최적화할 함수 $g(\alpha_1, \alpha_2)$는:
$$\begin{aligned} g(\alpha_1, \alpha_2) &= 2\alpha_1 + 2\alpha_2 \\ &\quad - \frac{5}{2}\alpha_1^2 - 4\alpha_1\alpha_2 - \frac{5}{2}\alpha_2^2 \end{aligned}$$

#### 3단계: 극값 계산
편미분을 0으로 두면 $\frac{\partial g}{\partial \alpha_1} = 2 - 5\alpha_1 - 4\alpha_2 = 0$, $\frac{\partial g}{\partial \alpha_2} = 2 - 4\alpha_1 - 5\alpha_2 = 0$이고, 두 식을 빼면 $\alpha_2 - \alpha_1 = 0$입니다. 그래서 $\alpha_1 = \alpha_2 = \alpha$로 둡니다:
$$\begin{aligned} g(\alpha) &= 2(\alpha + \alpha) \\ &\quad - \left( \frac{5}{2}\alpha^2 + 4\alpha^2 + \frac{5}{2}\alpha^2 \right) \\ &= 4\alpha - 9\alpha^2 \end{aligned}$$
$\alpha$로 미분하여 $0$으로 놓으면:
$$\frac{dg}{d\alpha} = 4 - 18\alpha = 0 \implies \alpha = \frac{4}{18} = \frac{2}{9}$$

따라서 최적의 라그랑주 승수는:
$$\begin{aligned} \alpha_1^* &= \frac{2}{9}, \\ \alpha_2^* &= \frac{2}{9}, \\ \alpha_3^* &= \alpha_1^* + \alpha_2^* = \frac{4}{9} \end{aligned}$$
모두 $\alpha_i^* > 0$ 이므로 세 점 모두 서포트 벡터입니다!

#### 4단계: 법선 벡터 $w^*$ 및 편향 $b^*$ 계산
- **$w^*$ 계산 (표현자 정리)**:
  $$\begin{aligned} w^* &= \sum_{i=1}^3 \alpha_i^* y_i x_i = \frac{2}{9}(+1)\begin{bmatrix} 1 \\ 2 \end{bmatrix} \\ &\quad + \frac{2}{9}(+1)\begin{bmatrix} 2 \\ 1 \end{bmatrix} + \frac{4}{9}(-1)\begin{bmatrix} 0 \\ 0 \end{bmatrix} \\ &= \frac{2}{9} \left( \begin{bmatrix} 1 \\ 2 \end{bmatrix} + \begin{bmatrix} 2 \\ 1 \end{bmatrix} \right) \\ &= \frac{2}{9} \begin{bmatrix} 3 \\ 3 \end{bmatrix} = \begin{bmatrix} 2/3 \\ 2/3 \end{bmatrix} \end{aligned}$$

- **$b^*$ 계산**:
  서포트 벡터 $x_1$은 마진 경계선 위에 있으므로 $y_1(\langle w^*, x_1 \rangle + b) = 1$:
  $$\begin{aligned} & (+1)\left( \begin{bmatrix} 2/3 & 2/3 \end{bmatrix} \begin{bmatrix} 1 \\ 2 \end{bmatrix} + b \right) = 1 \\ & \implies \left(\frac{2}{3} + \frac{4}{3}\right) + b = 1 \\ & \implies 2 + b = 1 \implies b^* = -1 \end{aligned}$$
  (검산 $x_2$): $\langle w^*, x_2 \rangle + b = (4/3 + 2/3) - 1 = 2 - 1 = +1 = y_2$ (성립!)  
  (검산 $x_3$): $\langle w^*, x_3 \rangle + b = 0 - 1 = -1 = y_3$ (성립!)

- **마진(Margin) $r$ 계산**:
  $$\begin{aligned} \|w^*\| &= \sqrt{\left(\frac{2}{3}\right)^2 + \left(\frac{2}{3}\right)^2} \\ &= \sqrt{\frac{8}{9}} = \frac{2\sqrt{2}}{3} \end{aligned}$$
  $$r = \frac{1}{\|w^*\|} = \frac{3}{2\sqrt{2}} = \frac{3\sqrt{2}}{4} \approx 1.0607$$

- **초평면 방정식**:
  $$\begin{aligned} & \frac{2}{3} x_1 + \frac{2}{3} x_2 - 1 = 0 \\ & \iff x_1 + x_2 - 1.5 = 0 \end{aligned}$$

- **볼록 껍질 관점과의 기하학적 일치 확인**:
  - 양성 껍질의 중점 $c = \frac{1}{2}x_1 + \frac{1}{2}x_2 = \begin{bmatrix} 1.5 \\ 1.5 \end{bmatrix}$
  - 음성 껍질의 점 $d = x_3 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$
  - 두 점 사이의 최단 벡터 $c - d = \begin{bmatrix} 1.5 \\ 1.5 \end{bmatrix}$
  - 초평면의 법선 벡터 $w = \begin{bmatrix} 2/3 \\ 2/3 \end{bmatrix}$는 $c - d$와 정확히 같은 방향입니다! 초평면은 $c$와 $d$의 중점인 $[0.75, 0.75]^\top$을 지나며 수직이등분합니다.
  - 마진 $r = \frac{3\sqrt{2}}{4}$는 $\|c - d\| = \frac{3\sqrt{2}}{2}$의 정확히 절반입니다. 볼록 껍질 가중치 $(\tfrac12, \tfrac12, 1)$은 쌍대 해 $(\tfrac29, \tfrac29, \tfrac49)$에 $\tfrac94$를 곱한 것으로, 두 관점의 해가 비례합니다.

---

## 12.4 커널(Kernels, 388~390쪽)

### 왜 필요한가 (직관)
만약 데이터가 도넛 모양(안쪽에 파란 점, 바깥 원에 빨간 점)처럼 선형적으로 도저히 분리할 수 없는 비선형 구조를 띤다면 어떻게 해야 할까요?
9장 선형 회귀에서 배웠던 강력한 기법을 다시 사용합니다: **특성 매핑(Feature Mapping) $\phi(x)$**\ 를 통해 데이터를 훨씬 더 높은 고차원 공간으로 날려버리는 것입니다!

저차원에서는 뒤엉켜 있던 데이터도 충분히 높은 고차원으로 올리면 선형 초평면 하나로 가를 수 있게 되는 경우가 많습니다(교재 밖 보충: Cover의 정리).
하지만 고차원 특성 벡터 $\phi(x)$를 직접 계산하는 것은 계산량이 너무 많고 메모리가 폭발합니다.
여기서 SVM 쌍대 문제의 장점이 드러납니다: **쌍대 문제에는 데이터 $x$가 오직 내적 $\langle \phi(x_i), \phi(x_j) \rangle$의 형태로만 존재**하므로, 고차원 좌표를 직접 구하지 않고 내적 결과값만 한 방에 계산해 주는 요술 함수 **커널 $k(x_i, x_j)$**\ 를 사용하면 됩니다. 이것이 바로 **커널 트릭(Kernel Trick)**\ 입니다!

### 정의와 성질

#### 1. 커널 함수와 재생 커널 힐베르트 공간 (RKHS)
입력 공간 $\mathcal{X}$ 상의 임의의 두 데이터 $x_i, x_j$에 대해, 어떤 힐베르트 공간 $\mathcal{H}$로의 특성 맵 $\phi: \mathcal{X} \to \mathcal{H}$가 존재하여 그 내적과 일치하는 함수 $k: \mathcal{X} \times \mathcal{X} \to \mathbb{R}$를 **커널(Kernel)**\ 이라 정의합니다 (교재 식 12.52):

$$k(x_i, x_j) = \langle \phi(x_i), \phi(x_j) \rangle_\mathcal{H}$$

#### 2. 그람 행렬(Gram Matrix)과 양의 준정부호성
교재는 커널을 "대칭이고 양의 준정부호인 함수"로 설명합니다. 이 조건이 커널이 되기 위한 필요충분조건이라는 것은 머서 정리 계열의 결과입니다(교재 밖 보충). 즉 유효한 커널의 조건은 대칭성($k(x_i, x_j) = k(x_j, x_i)$)과 **양의 준정부호성(Positive Semi-Definite, PSD)**\ 입니다.
데이터셋에 대한 커널 행렬(그람 행렬) $K \in \mathbb{R}^{N \times N}$ ($K_{ij} = k(x_i, x_j)$)은 모든 $z \in \mathbb{R}^N$에 대해 다음을 만족해야 합니다 (교재 식 12.53):

$$z^\top K z \ge 0$$

#### 3. 대표적인 커널 함수의 종류
1. **선형 커널 (Linear Kernel)**:
   $$k(x_i, x_j) = \langle x_i, x_j \rangle = x_i^\top x_j$$
2. **다항식 커널 (Polynomial Kernel)**:
   $$k(x_i, x_j) = (\langle x_i, x_j \rangle + c)^d \quad (c \ge 0, d \in \mathbb{N})$$
3. **가우시안 RBF 커널 (Radial Basis Function Kernel)**:
   $$k(x_i, x_j) = \exp\left( -\frac{\|x_i - x_j\|^2}{2\sigma^2} \right) = \exp(-\gamma \|x_i - x_j\|^2)$$
   > **성질**: 가우시안 RBF 커널에 대응하는 힐베르트 공간 $\mathcal{H}$는 **무한 차원(infinite-dimensional)** 공간입니다! 테일러 급수 전개를 통해 무한 차원의 다항식 특성 공간에서의 내적을 단 하나의 지수함수 계산으로 정확히 대체합니다.

#### 4. 커널 SVM의 최종 분류 결정 함수
학습된 최적의 쌍대 해 $\alpha^*$를 사용하면, 새로운 데이터 $x_{\text{test}}$에 대한 예측은 다음과 같이 커널 값들의 선형결합으로 즉시 계산됩니다:

$$f(x_{\text{test}}) = \sum_{n=1}^N \alpha_n^* y_n k(x_n, x_{\text{test}}) + b^*$$

서포트 벡터가 아닌 점들은 $\alpha_n^* = 0$이므로, **오직 서포트 벡터들과의 커널 유사도만 계산**하면 충분합니다!

### 손으로 풀어 보는 예제 (다항식 커널의 특성 맵 전개)
1차원 데이터 $x_i, x_j \in \mathbb{R}$에 대해 차수 $d=2, c=1$인 다항식 커널 $k(x_i, x_j) = (x_i x_j + 1)^2$를 생각하자.
이 커널에 대응하는 명시적 특성 매핑 $\phi(x)$를 구하시오.

**풀이**:
$$\begin{aligned} k(x_i, x_j) &= (x_i x_j + 1)^2 \\ &= (x_i x_j)^2 + 2(x_i x_j) + 1 \\ &= x_i^2 x_j^2 \\ &\quad + (\sqrt{2}x_i)(\sqrt{2}x_j) + 1 \cdot 1 \end{aligned}$$
이는 3차원 벡터 간의 표준 내적과 일치한다:
$$\langle \phi(x_i), \phi(x_j) \rangle = \begin{bmatrix} x_i^2 \\ \sqrt{2}x_i \\ 1 \end{bmatrix}^\top \begin{bmatrix} x_j^2 \\ \sqrt{2}x_j \\ 1 \end{bmatrix}$$
따라서 특성 매핑은 $\phi(x) = \begin{bmatrix} x^2 \\ \sqrt{2}x \\ 1 \end{bmatrix} \in \mathbb{R}^3$ 이다. 1차원 데이터를 3차원 포물선 공간으로 매핑한 것과 동일합니다.

---

## 12.5 수치적 해법(Numerical Solution, 390~392쪽)

### 왜 필요한가 (직관)
SVM의 목적함수를 도출했으니, 컴퓨터로 이를 실제로 풀어내는 알고리즘이 필요합니다. 교재는 크게 두 가지 수치 최적화 경로를 제시합니다:
1. 손실 함수 관점에서의 **서브그레디언트 경사하강법(Subgradient Descent)**.
2. 제약조건 최적화 관점에서의 **볼록 2차 계획법(Quadratic Programming, QP)** 표준형 변환.

### 정의와 성질

#### 1. 힌지 손실의 서브그레디언트 (Subgradient)
힌지 손실 $\ell(t) = \max\{0, 1-t\}$ ($t = y f(x)$)는 꺾인 점 $t = 1$에서 미분이 불가능합니다. 하지만 볼록 함수이므로 **서브그레디언트(subgradient)**\ 를 정의하여 최적화할 수 있습니다 (교재 식 12.54):

$$g(t) = \begin{cases} -1 & \text{if } t < 1 \\ [-1, 0] & \text{if } t = 1 \\ 0 & \text{if } t > 1 \end{cases}$$

이를 이용해 7장의 경사하강법·확률적 경사하강법을 그대로 쓸 수 있습니다(교재 밖 보충: Pegasos가 대표적인 SGD 기반 선형 SVM 학습법).

#### 2. 원시 SVM의 2차 계획법(QP) 표준형 (교재 식 12.56)
변수들을 하나의 긴 벡터 $\theta = \begin{bmatrix} w \\ b \\ \xi \end{bmatrix} \in \mathbb{R}^{D + 1 + N}$로 결합하면, 원시 SVM은 표준 QP 형태 $\min_\theta \frac{1}{2} \theta^\top P \theta + q^\top \theta \quad \text{s.t.} \quad A \theta \le h$ 로 정확히 표현됩니다:

$$\begin{aligned} & \min_{w, b, \xi} \frac{1}{2} \begin{bmatrix} w \\ b \\ \xi \end{bmatrix}^\top \begin{bmatrix} I_D & \mathbf{0} & \mathbf{0} \\ \mathbf{0} & 0 & \mathbf{0} \\ \mathbf{0} & \mathbf{0} & \mathbf{0} \end{bmatrix} \begin{bmatrix} w \\ b \\ \xi \end{bmatrix} \\ &\quad + \begin{bmatrix} \mathbf{0}_{D+1} \\ C \mathbf{1}_N \end{bmatrix}^\top \begin{bmatrix} w \\ b \\ \xi \end{bmatrix} \end{aligned}$$
$$\begin{aligned} \text{subject to} \quad & \begin{bmatrix} -YX & -y & -I_N \\ \mathbf{0} & 0 & -I_N \end{bmatrix} \begin{bmatrix} w \\ b \\ \xi \end{bmatrix} \\ & \le \begin{bmatrix} -\mathbf{1}_N \\ \mathbf{0}_N \end{bmatrix} \end{aligned}$$
여기서 $Y = \text{diag}(y)$, $X \in \mathbb{R}^{N \times D}$ 입니다.

#### 3. 쌍대 SVM의 2차 계획법(QP) 표준형 (교재 식 12.57)
쌍대 문제는 오직 $\alpha \in \mathbb{R}^N$에 대한 $N$차원 QP 문제입니다:
$$\min_\alpha \quad \frac{1}{2} \alpha^\top (Y K Y) \alpha - \mathbf{1}_N^\top \alpha$$
$$\text{subject to} \quad \begin{bmatrix} y^\top \\ -y^\top \\ -I_N \\ I_N \end{bmatrix} \alpha \le \begin{bmatrix} 0 \\ 0 \\ \mathbf{0}_N \\ C \mathbf{1}_N \end{bmatrix}$$
여기서 등식 제약조건 $y^\top \alpha = 0$은 두 개의 부등식 $y^\top \alpha \le 0$과 $-y^\top \alpha \le 0$으로 표준 변환되었습니다. (교재 밖 보충) 실무에서는 대규모 QP를 풀기 위해 SMO(Sequential Minimal Optimization) 알고리즘(LIBSVM)이 널리 쓰입니다.

---

## 12.6 더 읽을거리(Further Reading, 392~394쪽)

### 핵심 개념 정리
1. **로지스틱 회귀(Logistic Regression)와의 비교**:
   - SVM은 기하학적 마진 최대화에 기반한 **비확률적(non-probabilistic)** 모델이며, 손실 함수로 힌지 손실을 씁니다. 서포트 벡터가 아닌 점들은 손실이 0이므로 경계선 형성에 아무런 영향을 주지 않습니다(희소성, sparsity).
   - 로지스틱 회귀는 베르누이 가능도의 음의 로그 가능도(로그 손실 / 크로스 엔트로피)를 최소화하는 **확률적(probabilistic)** 모델입니다. 모든 데이터가 시그모이드 곡선을 통해 손실에 기여하므로 희소성이 없습니다.
2. **플랫 스케일링(Platt Scaling)**:
   - SVM의 결정 점수 $f(x) = \langle w, x \rangle + b$는 확률이 아닙니다. 이를 사후확률 $P(Y=1 \mid x)$로 변환하기 위해 추가적인 시그모이드 로지스틱 교정 함수 $P(Y=1 \mid x) = \frac{1}{1 + \exp(A f(x) + B)}$를 적합하는 기법입니다. (교재는 Platt(2000) 등의 보정 단계가 있다고만 언급하며, 이 식은 교재 밖 보충.)
3. **볼록 켤레(Fenchel Conjugate) 관점**:
   - 르장드르-펜첼 변환을 통해 힌지 손실의 볼록 켤레 함수를 구함으로써 라그랑주 승수법과 완전히 동일한 쌍대 SVM을 유도할 수 있습니다.

---

## 핵심 유도 모음 (백지에 직접 쓸 수 있어야 하는 유도)

### 유도 1: 점과 초평면 사이의 기하학적 거리 및 마진 $r = 1/\|w\|$ 유도

1. **설정**: 초평면 $\mathcal{H} = \{x : \langle w, x \rangle + b = 0\}$. 임의의 점 $x_a$ ($\langle w, x_a \rangle + b > 0$).
2. **수선의 발 $x_a'$ 정의**: $x_a'$는 초평면 위의 점이므로 $\langle w, x_a' \rangle + b = 0$.
3. **벡터 덧셈 관계식**: 법선 벡터 방향의 단위 벡터는 $\frac{w}{\|w\|}$이므로,
   $$x_a = x_a' + r \frac{w}{\|w\|} \quad (r > 0)$$
   *(이유: $w$가 초평면에 직교하므로 최단거리 벡터는 $w$와 평행함)*
4. **초평면 방정식 대입**:
   $$\langle w, x_a \rangle + b = \left\langle w, x_a' + r \frac{w}{\|w\|} \right\rangle + b = \underbrace{\langle w, x_a' \rangle + b}_{=0} + r \frac{\langle w, w \rangle}{\|w\|}$$
5. **내적의 성질 적용**: $\langle w, w \rangle = \|w\|^2$ 이므로,
   $$\langle w, x_a \rangle + b = r \frac{\|w\|^2}{\|w\|} = r \|w\| \implies r = \frac{\langle w, x_a \rangle + b}{\|w\|}$$
6. **마진 조건 스케일링**: 가장 가까운 서포트 벡터 $x_a$에서의 값을 $\langle w, x_a \rangle + b = 1$로 정규화하면:
   $$r = \frac{1}{\|w\|} \quad \blacksquare$$

---

### 유도 2: 원시 SVM에서 쌍대 SVM으로의 완전한 라그랑주 쌍대 유도

**목표**: 원시 소프트 마진 최적화 문제로부터 라그랑주 함수를 구성하고, $w, b, \xi$를 소거하여 $\alpha$만의 쌍대 문제를 유도한다.

1. **원시 문제 및 라그랑지안 구성**:
   $$\begin{aligned} L(w, b, \xi, \alpha, \gamma) &= \frac{1}{2} \|w\|^2 \\ &\quad + C \sum_{n=1}^N \xi_n \\ &\quad - \sum_{n=1}^N \alpha_n \Bigl( \\ &\qquad y_n (\langle w, x_n \rangle + b) - 1 + \xi_n \Bigr) \\ &\quad - \sum_{n=1}^N \gamma_n \xi_n \end{aligned}$$
   제약: $\alpha_n \ge 0, \gamma_n \ge 0$.

2. **$w, b, \xi$에 대한 편미분을 0으로 놓기 (KKT 1차 조건)**:
   - $\nabla_w L = w - \sum_{n=1}^N \alpha_n y_n x_n = \mathbf{0} \implies w = \sum_{n=1}^N \alpha_n y_n x_n$
   - $\frac{\partial L}{\partial b} = -\sum_{n=1}^N \alpha_n y_n = 0 \implies \sum_{n=1}^N \alpha_n y_n = 0$
   - $\frac{\partial L}{\partial \xi_n} = C - \alpha_n - \gamma_n = 0 \implies C - \alpha_n - \gamma_n = 0$

3. **라그랑지안의 항별 분해 및 소거**:
   $L$을 각 변수별로 묶어 정리하면 (교재 식 12.39):
   $$\begin{aligned} L &= \frac{1}{2} \|w\|^2 - \left\langle w, \sum_{n=1}^N \alpha_n y_n x_n \right\rangle \\ &\quad - b \underbrace{\left( \sum_{n=1}^N \alpha_n y_n \right)}_{=0} + \sum_{n=1}^N \alpha_n \\ &\quad + \sum_{n=1}^N \underbrace{(C - \alpha_n - \gamma_n)}_{=0} \xi_n \end{aligned}$$
   - $b$가 곱해진 항은 $\sum \alpha_n y_n = 0$에 의해 완전히 $0$이 되어 사라진다.
   - $\xi_n$이 곱해진 항은 $C - \alpha_n - \gamma_n = 0$에 의해 완전히 $0$이 되어 사라진다.

4. **$w$ 항의 대입 및 정리**:
   $w = \sum_{n=1}^N \alpha_n y_n x_n$을 대입하면:
   $$\begin{aligned} \frac{1}{2} \|w\|^2 &= \frac{1}{2} \Bigl\langle \sum_{i=1}^N \alpha_i y_i x_i, \\ &\quad \sum_{j=1}^N \alpha_j y_j x_j \Bigr\rangle \\ &= \frac{1}{2} \sum_{i=1}^N \\ &\quad \sum_{j=1}^N \alpha_i \alpha_j y_i y_j \langle x_i, x_j \rangle \end{aligned}$$
   뒤의 내적 항:
   $$\begin{aligned} &-\left\langle w, \sum_{i=1}^N \alpha_i y_i x_i \right\rangle \\ &= -\|w\|^2 \\ &= -\sum_{i=1}^N \\ &\quad \sum_{j=1}^N \alpha_i \alpha_j y_i y_j \langle x_i, x_j \rangle \end{aligned}$$
   두 항을 합치면:
   $$\begin{aligned} &\frac{1}{2}\|w\|^2 - \|w\|^2 \\ &= -\frac{1}{2}\|w\|^2 \\ &= -\frac{1}{2} \sum_{i=1}^N \\ &\quad \sum_{j=1}^N \alpha_i \alpha_j y_i y_j \langle x_i, x_j \rangle \end{aligned}$$

5. **쌍대 목적함수 $\mathcal{D}(\alpha)$ 완성**:
   $$\begin{aligned} \mathcal{D}(\alpha) &= \sum_{i=1}^N \alpha_i \\ &\quad - \frac{1}{2} \sum_{i=1}^N \sum_{j=1}^N \alpha_i \alpha_j y_i y_j \langle x_i, x_j \rangle \end{aligned}$$
   제약조건:
   - $\sum_{i=1}^N \alpha_i y_i = 0$
   - $\alpha_i \ge 0$ 이고, $\gamma_i = C - \alpha_i \ge 0 \implies \alpha_i \le C \implies 0 \le \alpha_i \le C$.

6. **최소화 문제로의 변환**:
   $\max \mathcal{D}(\alpha) \iff \min [-\mathcal{D}(\alpha)]$ 이므로:
   $$\begin{aligned} & \min_\alpha \frac{1}{2} \sum_{i=1}^N \sum_{j=1}^N \alpha_i \alpha_j y_i y_j \langle x_i, x_j \rangle \\ &\quad - \sum_{i=1}^N \alpha_i \quad \blacksquare \end{aligned}$$

---

## 말로 설명하기 (개념 서술형·구술 대비)

서술형 문항이나 구술 질문에 대비해 말로도 설명해 본다.

**Q. SVM은 왜 마진을 최대화하나요? 마진이 $1/\|w\|$인 이유는?**
"분리하는 직선이 여러 개면 양쪽 데이터에서 가장 멀리 떨어진 것이 새 데이터의 작은 흔들림에도 덜 틀리기 때문입니다. 초평면 $\langle w,x\rangle+b=0$은 $w,b$에 같은 양수를 곱해도 그대로라서, 가장 가까운 점에서 $y_n(\langle w,x_n\rangle+b)=1$이 되도록 크기를 고정할 수 있습니다. 그러면 점과 초평면 사이 거리 공식 $\frac{|\langle w,x\rangle+b|}{\|w\|}$에서 마진이 $1/\|w\|$이고, 마진 최대화는 $\frac12\|w\|^2$ 최소화와 같습니다."

**Q. 소프트 마진에서 $C$와 슬랙 변수의 역할은?**
"현실 데이터는 정확히 나뉘지 않으므로 점마다 위반량 $\xi_n\ge0$을 허용해 $y_n f(x_n)\ge1-\xi_n$으로 완화합니다. $\xi_n$이 0과 1 사이면 마진 안쪽, 1보다 크면 오분류입니다. $C$가 크면 위반을 거의 허용하지 않아 마진이 좁아지고 과적합 위험이 커지며, 작으면 마진이 넓어지고 과소적합 위험이 커집니다."

**Q. 힌지 손실 관점으로 SVM을 설명해 보세요.**
"$\min\frac12\|w\|^2+C\sum\max\{0,1-y_nf(x_n)\}$로, 정규화 항과 힌지 손실의 합을 최소화하는 경험적 위험 최소화입니다. 힌지 손실은 0-1 손실의 볼록 상한이고, $\xi_n\ge0,\ \xi_n\ge1-t$ 제약으로 바꾸면 슬랙 변수를 쓴 기하학적 문제와 정확히 같아집니다."

**Q. 쌍대 문제를 왜 푸나요? 유도 과정을 요약해 보세요.**
"라그랑지안에서 $w$, $b$, $\xi$로 미분해 0으로 두면 $w=\sum\alpha_ny_nx_n$, $\sum\alpha_ny_n=0$, $\alpha_n+\gamma_n=C$가 나옵니다. 대입하면 $\alpha$만 남은 $\max\sum\alpha_n-\frac12\sum\sum\alpha_i\alpha_jy_iy_j\langle x_i,x_j\rangle$, 제약 $0\le\alpha_n\le C$가 됩니다. 변수 수가 차원 $D$가 아니라 데이터 수 $N$이고, 데이터가 내적으로만 나타나 커널로 바꿀 수 있다는 것이 장점입니다."

**Q. 서포트 벡터는 무엇이고 왜 해가 희소한가요?**
"$\alpha_n>0$인 점입니다. 상보 여유성 때문에 마진 바깥에 여유 있게 있는 점은 $\alpha_n=0$이 되어 $w$에 기여하지 않습니다. $0<\alpha_n<C$면 마진 경계 바로 위에 있어 $b$를 구하는 데 쓰고, $\alpha_n=C$면 마진을 침범했거나 오분류된 점입니다."

**Q. 커널 트릭이란? 어떤 함수가 커널이 될 수 있나요?**
"쌍대 문제와 예측식에 데이터가 내적으로만 나오므로, 내적을 $k(x_i,x_j)=\langle\phi(x_i),\phi(x_j)\rangle$로 바꾸면 고차원 특징 $\phi$를 직접 계산하지 않고도 그 공간에서 선형 분리를 할 수 있습니다. 커널은 대칭이고 양의 준정부호여서 어떤 데이터에서든 그람 행렬이 양의 준정부호여야 합니다. 다항식 커널과 가우시안 RBF 커널이 대표적이며, RBF는 무한 차원 특징 공간에 해당합니다."

**Q. 볼록 껍질 관점은 무엇인가요?**
"하드 마진 쌍대 SVM은 두 클래스 점들의 볼록 껍질 사이에서 가장 가까운 두 점을 찾는 문제와 같습니다. 최적 초평면은 그 최단 선분을 수직이등분하고, 마진은 최단 거리의 절반입니다."

---

## 연습문제

### 확인 문제 (계산형 및 개념형 10제)

#### [문제 1: 1차원 하드 마진 SVM 손계산]
1차원 공간에 세 개의 데이터가 있다:
- $x_1 = 1, y_1 = -1$
- $x_2 = 2, y_2 = -1$
- $x_3 = 6, y_3 = +1$
하드 마진 분리 초평면(점) $w x + b = 0$의 최적 매개변수 $w^*, b^*$와 마진 $r$을 구하시오.

**[풀이]**
1차원에서 분리 초평면은 두 클래스 사이의 경계점이다.
음성 클래스 중 가장 큰 점은 $x_2 = 2$, 양성 클래스 중 가장 작은 점은 $x_3 = 6$이다.
서포트 벡터는 $x_2$와 $x_3$이다.
마진 경계선 조건:
$w(2) + b = -1$
$w(6) + b = +1$
두 식을 빼면: $4w = 2 \implies w^* = \frac{1}{2} = 0.5$.
대입하면: $0.5(2) + b = -1 \implies 1 + b = -1 \implies b^* = -2$.
결정 경계점: $0.5 x - 2 = 0 \implies x = 4$. (2와 6의 정확한 중점!)
마진 $r = \frac{1}{|w|} = \frac{1}{0.5} = 2$. (경계점 4에서 2와 6까지의 거리는 정확히 2).

---

#### [문제 2: 마진 크기 비교]
초평면 $A: 3x_1 + 4x_2 - 5 = 0$ 과 초평면 $B: x_1 + x_2 - 1 = 0$ 이 각각 서포트 벡터에서의 함수값이 $\pm 1$이 되도록 표준화되어 있다고 할 때, 두 초평면의 마진 $r_A, r_B$를 비교하시오.

**[풀이]**
마진 공식: $r = \frac{1}{\|w\|}$.
- 초평면 $A$: $w_A = \begin{bmatrix} 3 \\ 4 \end{bmatrix} \implies \|w_A\| = \sqrt{3^2 + 4^2} = 5 \implies r_A = \frac{1}{5} = 0.2$.
- 초평면 $B$: $w_B = \begin{bmatrix} 1 \\ 1 \end{bmatrix} \implies \|w_B\| = \sqrt{1^2 + 1^2} = \sqrt{2} \implies r_B = \frac{1}{\sqrt{2}} \approx 0.7071$.
따라서 초평면 $B$의 마진이 초평면 $A$보다 훨씬 크다 ($r_B > r_A$).

---

#### [문제 3: 힌지 손실 수치 계산]
데이터셋이 다음과 같다:
- $(x_1, y_1) = ([1, 1]^\top, +1)$
- $(x_2, y_2) = ([2, 0]^\top, -1)$
현재 모델 파라미터가 $w = [1, -1]^\top, b = 0$일 때, 두 데이터에서 발생하는 힌지 손실의 합을 구하시오.

**[풀이]**
1. $x_1$: $f(x_1) = 1(1) - 1(1) + 0 = 0$.
   $$t_1 = y_1 f(x_1) = (+1)(0) = 0 \implies \ell_1 = \max\{0, 1 - 0\} = 1.0$$
2. $x_2$: $f(x_2) = 1(2) - 1(0) + 0 = 2$.
   $$t_2 = y_2 f(x_2) = (-1)(2) = -2 \implies \ell_2 = \max\{0, 1 - (-2)\} = 3.0$$
총 힌지 손실: $1.0 + 3.0 = 4.0$.

---

#### [문제 4: 소프트 마진 SVM에서 $C$의 역할]
소프트 마진 SVM 목적함수 $\frac{1}{2}\|w\|^2 + C \sum \xi_n$에서 $C$ 값을 매우 크게 설정할 때와 매우 작게 설정할 때 모델의 마진 너비와 결정 경계의 특성이 어떻게 달라지는지 편향-분산 트레이드오프(bias-variance tradeoff) 관점에서 설명하시오.

**[풀이]**
- **$C \to \infty$ (큰 값)**: 슬랙 변수 $\xi_n$에 대한 패널티가 극도로 커져 오분류를 전혀 용납하지 않으려 한다. 마진의 너비가 좁아지고 결정 경계가 훈련 데이터의 이상치에 민감하게 반응하여 복잡해진다 $\implies$ 편향 감소, 분산 증가 (과적합 위험).
- **$C \to 0$ (작은 값)**: 마진을 넓히는 규제항 $\frac{1}{2}\|w\|^2$의 비중이 커져서, 데이터가 마진을 침범하거나 오분류되는 것을 관대하게 허용한다. 마진이 매우 넓어지고 결정 경계가 단순해진다 $\implies$ 편향 증가, 분산 감소 (과소적합 위험).

---

#### [문제 5: 서포트 벡터의 정의와 희소성(Sparsity)]
SVM의 최적해에서 "서포트 벡터(Support Vector)"가 무엇인지 라그랑주 승수 $\alpha_n$의 값으로 정의하고, SVM의 해가 왜 희소(sparse)하다고 불리는지 설명하시오.

**[풀이]**
표현자 정리에 의해 $w^* = \sum_{n=1}^N \alpha_n^* y_n x_n$이다. 여기서 **$\alpha_n^* > 0$인 데이터 포인트 $x_n$**\ 을 서포트 벡터라고 부른다.
마진 경계선 바깥에 안전하게 올바르게 분류된 대다수의 데이터 포인트들은 KKT 조건에 의해 $\alpha_n^* = 0$이 된다. 따라서 전체 데이터 중 오직 극소수의 서포트 벡터들만이 최종 가중치 벡터 $w^*$를 결정하는 데 참여하며, 나머지 데이터는 제거해도 결정 경계가 전혀 변하지 않는다. 이처럼 해 벡터 $\alpha^*$의 대부분의 성분이 0인 성질을 해의 **희소성(sparsity)**\ 이라 부른다.

---

#### [문제 6: 편향 $b^*$의 결정 방식]
쌍대 SVM 문제를 풀어 최적의 $\alpha^*$를 구한 후, 편향 $b^*$를 단 하나의 수식으로 계산할 때 어떤 데이터 포인트를 선택해야 가장 수치적으로 안정적인지 KKT 조건에 근거하여 설명하시오.

**[풀이]**
KKT 상보 여유성 조건에 의해, **박스 제약조건의 엄격한 내부($0 < \alpha_n^* < C$)에 있는 자유 서포트 벡터(free support vector)**\ 를 선택해야 한다.
이 점들은 슬랙 변수 $\xi_n = 0$이 엄밀히 보장되므로 마진 경계선 바로 위에 정확히 놓여 있다 ($y_n (\langle w^*, x_n \rangle + b^*) = 1$).
양변에 $y_n$을 곱하면 ($y_n^2 = 1$이므로):
$$\begin{aligned} b^* &= y_n - \langle w^*, x_n \rangle \\ &= y_n - \sum_{j=1}^N \alpha_j^* y_j \langle x_j, x_n \rangle \end{aligned}$$
로 정확하게 계산할 수 있다. (교재 식 (12.42) 뒤 비고: 마진 위에 정확히 놓인 점이 없을 수도 있으므로, 모든 서포트 벡터에서 $|y_n - \langle w^*, x_n \rangle|$를 계산해 그 **중앙값**을 쓰라고 한다. 평균을 쓰는 구현도 있다.)

---

#### [문제 7: 커널 행렬의 조건]
임의의 함수 $k(x, z)$가 유효한 커널 함수가 되기 위해 그람 행렬 $K$가 만족해야 하는 두 가지 선형대수학적 조건을 제시하시오.

**[풀이]**
1. **대칭성(Symmetry)**: 모든 $i, j$에 대해 $K_{ij} = K_{ji}$ (즉, $K = K^\top$).
2. **양의 준정부호성(Positive Semi-Definite, PSD)**: 임의의 0이 아닌 실수 벡터 $z \in \mathbb{R}^N$에 대해 $z^\top K z \ge 0$이어야 하며, 모든 고유값(eigenvalue)이 0 이상이어야 한다.

---

#### [문제 8: 가우시안 RBF 커널과 무한 차원 공간]
1차원 데이터에서 가우시안 RBF 커널 $k(x, z) = \exp\left(-\frac{(x-z)^2}{2}\right)$가 어떻게 무한 차원 특성 공간의 내적으로 해석될 수 있는지 지수함수의 테일러 급수 전개를 통해 보이시오.

**[풀이]**
$$\begin{aligned} k(x, z) &= \exp\left(-\frac{x^2 - 2xz + z^2}{2}\right) \\ &= \exp\left(-\frac{x^2}{2}\right) \exp\left(-\frac{z^2}{2}\right) \exp(xz) \end{aligned}$$
$\exp(xz)$를 매클로린 급수(테일러 전개)로 전개하면:
$$\begin{aligned} \exp(xz) &= \sum_{m=0}^\infty \frac{(xz)^m}{m!} \\ &= \sum_{m=0}^\infty \left( \frac{x^m}{\sqrt{m!}} \right) \left( \frac{z^m}{\sqrt{m!}} \right) \end{aligned}$$
따라서:
$$\begin{aligned} k(x, z) &= \sum_{m=0}^\infty \left[ \exp\left(-\frac{x^2}{2}\right) \frac{x^m}{\sqrt{m!}} \right] \\ &\quad \left[ \exp\left(-\frac{z^2}{2}\right) \frac{z^m}{\sqrt{m!}} \right] \\ &= \langle \phi(x), \phi(z) \rangle_{\ell_2} \end{aligned}$$
여기서 특성 맵 $\phi(x) = \exp(-x^2/2) \left[ 1, x, \frac{x^2}{\sqrt{2!}}, \frac{x^3}{\sqrt{3!}}, \dots \right]^\top$ 은 무한 차원 벡터가 된다.

---

#### [문제 9: 볼록 껍질과 선형 분리 가능성]
데이터셋이 선형 분리 가능(linearly separable)하다는 조건을 두 클래스의 볼록 껍질(convex hull)의 기하학적 관계를 이용하여 서술하시오.

**[풀이]**
양성 클래스 데이터셋의 볼록 껍질 $\text{conv}(X^+)$와 음성 클래스 데이터셋의 볼록 껍질 $\text{conv}(X^-)$가 **서로 겹치지 않을 때(disjoint, 즉 $\text{conv}(X^+) \cap \text{conv}(X^-) = \emptyset$)**, 데이터셋은 선형 분리 가능하다. (분리 초평면 정리에 의해 서로 만나지 않는 두 닫힌 볼록 집합 사이에는 반드시 이 둘을 엄격히 분리하는 초평면이 존재함).

---

#### [문제 10: SVM과 로지스틱 회귀의 결정적 차이]
분류 문제에서 SVM과 로지스틱 회귀(Logistic Regression)를 비교할 때, 새로운 이상치 데이터가 기존 결정 경계에서 아주 멀리 떨어진 올바른 방향($y_n f(x_n) \gg 1$)에 추가되었을 때 두 모델의 경계선이 어떻게 반응하는지 설명하시오.

**[풀이]**
- **SVM**: 마진 바깥 올바른 쪽에 위치한 데이터는 힌지 손실이 정확히 $0$이고 라그랑주 승수 $\alpha_n = 0$이므로, 결정 경계선에 **아무런 영향도 주지 않는다** (정확히 불변).
- **로지스틱 회귀**: 멀리 떨어진 데이터라도 시그모이드 확률이 $1$에 매우 가까울 뿐 손실이 정확히 $0$은 아니므로, 미세하게나마 그라디언트를 발생시켜 결정 경계선을 조금씩 움직인다. 즉, 올바른 쪽 멀리 있는 점에는 SVM 경계가 전혀 반응하지 않는다. 다만 잘못 분류된 먼 이상치에는 힌지 손실과 로지스틱 손실이 모두 거의 선형으로 커지므로 두 모델 다 영향을 받는다. SVM이 모든 이상치에 강건하다는 뜻은 아니다.

---

### 교재 연습문제 안내 (Exercises)

> **교재 원문 안내**: MML 교재 원본의 Part 2(8~12장)는 실전 머신러닝 응용을 다루는 장으로, 장 끝 연습문제(Exercises) 섹션이 별도로 수록되어 있지 않습니다. 따라서 본 해설서에서는 교재 본문의 예제와 핵심 유도를 바탕으로 이 해설이 만든 확인 문제를 싣습니다.

#### [본문 핵심 과제 1: 표현자 정리(Representer Theorem)의 유도 (교재 384쪽 식 12.38)]
- **질문 요약**: 라그랑지안 $\mathcal{L}$을 원시 변수 $w$로 편미분하여 최적의 $w$가 데이터의 선형결합 $w = \sum_{n=1}^N \alpha_n y_n x_n$으로 표현됨을 유도하시오.
- **풀이 방향**: $\nabla_w \left( \frac{1}{2}\|w\|^2 - \sum \alpha_n y_n \langle w, x_n \rangle \right) = w - \sum \alpha_n y_n x_n = 0$ 으로부터 즉시 도출됩니다.

#### [본문 핵심 과제 2: 힌지 손실의 슬랙 변수 동치 변환 (교재 382쪽 식 12.32~12.33)]
- **질문 요약**: $\min_t \max\{0, 1-t\}$가 $\min_{\xi, t} \xi \quad \text{s.t.} \quad \xi \ge 0, \xi \ge 1-t$와 동치임을 기하학적으로 증명하시오.
- **풀이 방향**: $\max\{a, b\}$는 $a$와 $b$ 모두보다 크거나 같은 가장 작은 수입니다. 따라서 목적함수를 $\xi$로 치환하고 $\xi \ge a$와 $\xi \ge b$를 제약조건으로 부과하면 최적화 관점에서 정확히 동치입니다.

#### [본문 핵심 과제 3: 쌍대 SVM에서 편향 조건 $\sum \alpha_n y_n = 0$의 기하학적 의미 (교재 387쪽)]
- **질문 요약**: 볼록 껍질의 가중치 합 조건 $\sum \alpha_n^+ = 1, \sum \alpha_n^- = 1$로부터 $\sum_{n=1}^N \alpha_n y_n = 0$이 도출됨을 보이시오.
- **풀이 방향**: $y_n$이 양성일 때 $+1$, 음성일 때 $-1$이므로 $\sum y_n \alpha_n = \sum \alpha_n^+ - \sum \alpha_n^- = 1 - 1 = 0$이 성립합니다.

---

## 시험 직전 10분 요약

| 개념 / 수식 | 핵심 내용 및 판별 기준 | 주의할 점 |
|---|---|---|
| **분리 초평면** | $\langle w, x \rangle + b = 0$ | $w$는 법선 벡터, $b$는 편향 |
| **마진 (Margin)** | $r = \frac{1}{\|w\|}$ (스케일 정규화 시) | 마진 최대화 $\iff \min \frac{1}{2}\|w\|^2$ |
| **하드 마진 원시 문제** | $\min \frac{1}{2}\|w\|^2 \quad \text{s.t.} \quad y_n(\langle w, x_n \rangle + b) \ge 1$ | 선형 분리 가능 데이터 전용 |
| **소프트 마진 원시 문제** | $\min \frac{1}{2}\|w\|^2 + C \sum \xi_n \quad \text{s.t.} \quad y_n(\dots) \ge 1 - \xi_n, \xi_n \ge 0$ | 슬랙 변수 $\xi_n$ 도입 ($C$-SVM) |
| **힌지 손실 관점** | $\min \frac{1}{2}\|w\|^2 + C \sum \max\{0, 1 - y_n f(x_n)\}$ | 0-1 손실의 볼록 상한, 비제약 최적화 |
| **표현자 정리** | $w^* = \sum_{n=1}^N \alpha_n^* y_n x_n$ | $w$는 훈련 데이터의 선형결합 안에 존재 |
| **쌍대 SVM 문제** | $\min_\alpha \frac{1}{2} \sum_{i,j} \alpha_i \alpha_j y_i y_j \langle x_i, x_j \rangle - \sum \alpha_i$ | $\sum \alpha_i y_i = 0, \ 0 \le \alpha_i \le C$ |
| **서포트 벡터의 분류** | $\alpha_n = 0$ (안전한 점), $0 < \alpha_n < C$ (마진 위 점), $\alpha_n = C$ (침범/오분류) | 편향 $b^*$ 계산은 $0 < \alpha_n < C$인 점에서 수행 |
| **볼록 껍질 관점** | $\min \frac{1}{2}\|c - d\|^2 \quad (c \in \text{conv}(X^+), d \in \text{conv}(X^-))$ | 두 다포체 사이의 최단 거리 수직이등분 |
| **커널 트릭 (Kernel Trick)** | $\langle x_i, x_j \rangle \longrightarrow k(x_i, x_j) = \langle \phi(x_i), \phi(x_j) \rangle$ | 그람 행렬 $K$는 반드시 대칭 및 PSD |
| **결정 함수 (커널)** | $f(x) = \sum_{n \in \text{SV}} \alpha_n^* y_n k(x_n, x) + b^*$ | 서포트 벡터들과의 유사도 합으로 판정 |
