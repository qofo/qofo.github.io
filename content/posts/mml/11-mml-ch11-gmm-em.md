---
title: "MML 11장 GMM: 가우시안 혼합 모델과 EM 알고리즘"
slug: "mml-ch11-gmm-em"
date: 2026-10-12
weight: 11
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "GMM", "EM 알고리즘", "밀도 추정"]
description: "MML 11장(교재 348~369쪽) 해설. 가우시안 혼합 모델의 최대가능도 학습, 책임도 계산과 평균·공분산·가중치 갱신식 유도, EM 알고리즘 한 바퀴 손계산, 잠재변수 관점을 정리했다."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재 쪽수**: 348~369쪽 (Chapter 11)  
> **선수 지식 및 연계**: 5장 벡터 미적분(Vector Calculus: 야코비안 및 행렬 미분), 6장 확률과 분포(Probability and Distributions: 다변수 가우시안 분포, 베이즈 정리, 주변확률), 7장 연속 최적화(Continuous Optimization: 라그랑주 승수법), 8장 모델과 데이터(When Models Meet Data: 최대가능도 추정 MLE, 경험적 위험).  
> **작성:** Antigravity CLI(agy) 초안, Claude 검토. 숫자 예제(식 11.5의 밀도, EM 1회 손계산)는 numpy로 검산했고, 교재와 다른 서술은 고쳤다.  
> **후속 연계**: 비지도 학습의 대표격인 밀도 추정(density estimation) 및 군집화(clustering)의 수학적 기반을 확립하며, 12장 서포트 벡터 머신(SVM)의 결정 경계 및 확률적 분류 관점과 대조됩니다.

---

## 0. 이 장 지도

이 장은 머신러닝의 3대 기둥(회귀 9장, 차원 축소 10장, 밀도 추정 11장) 중 마지막 기둥인 **밀도 추정(Density Estimation)**을 다룹니다. 현실 세계의 데이터는 단일 정규분포처럼 봉우리가 하나인 단봉(unimodal) 형태가 아니라, 여러 집단이 섞여 있는 다봉(multimodal) 형태를 띱니다. 이를 수학적으로 정교하게 모델링하기 위해 도입하는 도구가 바로 **가우시안 혼합 모델(Gaussian Mixture Model, GMM)**과 이를 학습시키는 **기댓값 최대화(Expectation-Maximization, EM) 알고리즘**입니다.

### [절 목록 및 핵심 요약]
- **11.1 가우시안 혼합 모델(Gaussian Mixture Model, 349~350쪽) [중요도: ★★★]**: 여러 개의 가우시안 확률밀도를 볼록 결합(convex combination)하여 복잡한 다봉 밀도를 표현하는 기본 모형 정의.
- **11.2 최대가능도 기반 모수 학습(Parameter Learning via Maximum Likelihood, 350~360쪽) [중요도: ★★★]**: 데이터의 로그 가능도 함수를 유도하고, 닫힌 형태의 해(closed-form solution)가 존재하지 않는 이유 분석.
  - **11.2.1 책임도(Responsibilities, 352~353쪽)**: 데이터 $x_n$이 $k$번째 가우시안 성분에서 생성되었을 사후확률 $r_{nk}$ 정의.
  - **11.2.2 평균 벡터 갱신(Updating the Means, 353~355쪽) [Theorem 11.1]**: 책임도를 가중치로 사용하는 가중 평균 갱신식 유도.
  - **11.2.3 공분산 행렬 갱신(Updating the Covariances, 356~358쪽) [Theorem 11.2]**: 행렬 미분을 통한 책임도 기반 가중 공분산 갱신식 유도.
  - **11.2.4 혼합 가중치 갱신(Updating the Mixture Weights, 358~360쪽) [Theorem 11.3]**: 등식 제약조건 하에서 라그랑주 승수법을 이용한 $\pi_k$ 갱신식 유도.
- **11.3 EM 알고리즘(EM Algorithm, 360~363쪽) [중요도: ★★★]**: E-단계(책임도 계산)와 M-단계(모수 재추정)를 교대로 반복하여 로그 가능도를 단조 증가시키는 알고리즘 절차 확립.
- **11.4 잠재변수 관점(Latent-Variable Perspective, 363~367쪽) [중요도: ★★★]**: 이산 잠재변수 $z$의 일-핫 인코딩(one-hot encoding)을 도입하여 GMM의 계층적 확률 생성 과정을 정식화하고, EM 알고리즘의 일반 이론($Q$-함수 기댓값 최대화)으로 확장.
- **11.5 더 읽을거리(Further Reading, 368~369쪽) [중요도: ★★☆]**: 조상 표집(ancestral sampling), K-평균(K-means)과의 이론적 관계(Hard vs Soft assignment), 최대가능도의 특이성(singularity) 문제, 비모수 밀도 추정(히스토그램 및 커널 밀도 추정 KDE).

### [개념 간 의존 관계]
```
[다봉 데이터 분포 문제 인식]
         │
         ▼
[11.1 GMM 정의: 볼록 결합]
         │
         ▼
[11.2 로그 가능도 설정] ──▶ [로그 안의 합(log of sum)으로 인해 닫힌 해 부재]
         │
         ▼
[11.2.1 책임도 r_nk 정의 (사후확률)]
         │
 ┌───────┴─────────────────────────┐
 ▼                                 ▼                                 ▼
[11.2.2 평균 갱신 (Thm 11.1)]   [11.2.3 공분산 갱신 (Thm 11.2)]   [11.2.4 가중치 갱신 (Thm 11.3)]
 └───────┬─────────────────────────┴─────────────────────────────────┘
         │
         ▼
[11.3 EM 알고리즘 (E-step ↔ M-step 반복)]
         │
         ▼
[11.4 잠재변수 z 도입 (1-of-K) ──▶ 완전 결합분포 p(x, z) ──▶ 일반 EM의 Q-함수 유도]
         │
         ▼
[11.5 K-평균과의 극한 관계, 특이성(과적합) 문제, 비모수 KDE 비교]
```

---

## 11.1 가우시안 혼합 모델(Gaussian Mixture Model, 349~350쪽)

### 왜 필요한가 (직관)
우리가 6장과 8장에서 배웠던 단일 가우시안 분포(단일 정규분포, Single Gaussian Distribution)는 매우 편리한 수학적 성질을 가지고 있습니다. 하지만 치명적인 한계가 있습니다. 바로 봉우리가 언제나 단 하나인 **단봉 분포(unimodal distribution)**라는 점입니다.

현실의 데이터를 생각해 봅시다. 예를 들어 사람들의 키를 측정하면 남성 집단(평균 약 175cm)과 여성 집단(평균 약 162cm)의 두 봉우리가 겹쳐서 나타납니다. 만약 이 데이터를 단 하나의 정규분포로 표현하려고 하면, 평균은 엉뚱하게 168cm 근처에 놓이고 분산은 비정상적으로 커져서 데이터의 실제 특성을 심각하게 왜곡합니다. 
교재 그림 11.1처럼 2차원 평면에서 데이터가 여러 개의 뚜렷한 군집(cluster)으로 나뉘어 있을 때도 마찬가지입니다. 

따라서 우리는 여러 개의 간단한 기본 분포(base distribution)들을 부드럽게 섞어서 임의의 복잡한 형태와 여러 개의 봉우리를 가진 다봉 분포(multimodal distribution)를 표현할 수 있는 모델이 필요합니다. 이것이 바로 **혼합 모델(Mixture Model)**이며, 기본 분포로 가우시안 분포를 채택한 것이 **가우시안 혼합 모델(GMM)**입니다.

### 정의와 성질

#### 1. 일반적인 혼합 모델 (Mixture Model)
$K$개의 기본 확률밀도 함수 $p_1(x), p_2(x), \dots, p_K(x)$가 주어졌을 때, 전체 확률밀도 $p(x)$를 이들의 **볼록 결합(convex combination)**으로 정의합니다 (교재 식 11.1, 11.2):

$$p(x) = \sum_{k=1}^K \pi_k p_k(x)$$

여기서 $\pi_k$는 **혼합 가중치(mixture weight)** 또는 혼합 계수(mixing coefficient)라고 부르며 다음 두 조건을 만족해야 합니다:
1. 모든 $k$에 대해 $0 \le \pi_k \le 1$
2. 모든 가중치의 합은 1: $\sum_{k=1}^K \pi_k = 1$

이 두 조건 덕분에 $p(x)$를 전체 영역에 대해 적분하면:
$$\int p(x) dx = \sum_{k=1}^K \pi_k \int p_k(x) dx = \sum_{k=1}^K \pi_k \cdot 1 = 1$$
이 성립하여 $p(x)$는 수학적으로 완벽한 확률밀도 함수의 자격을 갖춥니다.

#### 2. 가우시안 혼합 모델 (GMM)
기본 분포 $p_k(x)$로 $D$차원 다변수 가우시안 분포 $\mathcal{N}(x \mid \mu_k, \Sigma_k)$를 사용합니다 (교재 식 11.3, 11.4):

$$p(x \mid \theta) = \sum_{k=1}^K \pi_k \mathcal{N}(x \mid \mu_k, \Sigma_k)$$

- $K$: 혼합 성분(mixture component)의 개수 (초매개변수)
- $\mu_k \in \mathbb{R}^D$: $k$번째 가우시안 성분의 평균 벡터(mean vector)
- $\Sigma_k \in \mathbb{R}^{D \times D}$: $k$번째 가우시안 성분의 공분산 행렬(covariance matrix, 대칭 행렬이자 양의 정부호(positive definite))
- $\theta := \{\pi_k, \mu_k, \Sigma_k\}_{k=1}^K$: GMM이 학습해야 할 전체 모수(parameters)의 집합

### 손으로 풀어 보는 예제 (작은 숫자 계산)
교재 식 (11.5)에 등장하는 1차원 GMM 모델을 살펴봅시다:
$$p(x \mid \theta) = 0.5 \mathcal{N}(x \mid -2, 0.5) + 0.2 \mathcal{N}(x \mid 1, 2) + 0.3 \mathcal{N}(x \mid 4, 1)$$
여기서 $K=3$이며:
- 성분 1: $\pi_1 = 0.5$, $\mu_1 = -2$, $\sigma_1^2 = 0.5$
- 성분 2: $\pi_2 = 0.2$, $\mu_2 = 1$, $\sigma_2^2 = 2.0$
- 성분 3: $\pi_3 = 0.3$, $\mu_3 = 4$, $\sigma_3^2 = 1.0$

**문제**: $x = 1.0$에서의 전체 확률밀도 $p(x=1.0 \mid \theta)$를 계산하시오.

**풀이 단계**:
1차원 정규분포 공식: $\mathcal{N}(x \mid \mu, \sigma^2) = \frac{1}{\sqrt{2\pi \sigma^2}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$

1. 성분 1의 밀도:
   $$\mathcal{N}(1 \mid -2, 0.5) = \frac{1}{\sqrt{2\pi \times 0.5}} \exp\left(-\frac{(1 - (-2))^2}{2 \times 0.5}\right) = \frac{1}{\sqrt{\pi}} \exp(-9) \approx 0.5642 \times 0.0001234 = 0.00007$$
2. 성분 2의 밀도:
   $$\mathcal{N}(1 \mid 1, 2) = \frac{1}{\sqrt{2\pi \times 2}} \exp\left(-\frac{(1 - 1)^2}{4}\right) = \frac{1}{\sqrt{4\pi}} \exp(0) = \frac{1}{2\sqrt{\pi}} \approx \frac{1}{3.5449} \approx 0.2821$$
3. 성분 3의 밀도:
   $$\mathcal{N}(1 \mid 4, 1) = \frac{1}{\sqrt{2\pi \times 1}} \exp\left(-\frac{(1 - 4)^2}{2 \times 1}\right) = \frac{1}{\sqrt{2\pi}} \exp(-4.5) \approx 0.3989 \times 0.01111 = 0.0044$$
4. 혼합 가중치 결합:
   $$p(x=1.0 \mid \theta) = 0.5(0.00007) + 0.2(0.2821) + 0.3(0.0044) = 0.000035 + 0.05642 + 0.00132 = 0.057775 \approx 0.0578$$

### 헷갈리는 점 / 자주 하는 실수
- **혼합 가중치의 의미**: $\pi_k$는 단순히 가우시안 곡선의 높이를 조절하는 상수가 아니라, 전체 데이터 공간에서 임의의 한 점을 뽑았을 때 그 점이 $k$번째 가우시안에서 발생했을 **사전확률(prior probability)**입니다.
- **분포의 합 vs 확률변수의 합**: 
  - $X \sim \sum \pi_k \mathcal{N}(\mu_k, \Sigma_k)$는 **확률밀도 함수의 혼합(mixture)**입니다.
  - 두 독립 정규 확률변수의 합 $Y = X_1 + X_2$는 여전히 **단일 정규분포** $\mathcal{N}(\mu_1+\mu_2, \Sigma_1+\Sigma_2)$가 됩니다. 초심자가 가장 많이 혼동하는 대목이므로, "확률변수의 선형결합"과 "확률밀도의 볼록결합"을 엄격히 구분해야 합니다.

---

## 11.2 최대가능도 기반 모수 학습(Parameter Learning via Maximum Likelihood, 350~360쪽)

### 왜 필요한가 (직관)
우리가 가진 관측 데이터셋 $\mathcal{X} = \{x_1, x_2, \dots, x_N\}$이 주어졌을 때, 이 데이터들을 가장 잘 설명하는 모수 $\theta = \{\pi_k, \mu_k, \Sigma_k\}_{k=1}^K$를 찾아야 합니다.
통계학에서 가장 보편적인 방법은 **최대가능도 추정법(Maximum Likelihood Estimation, MLE)**입니다.

단일 가우시안 분포의 경우, 로그를 취하면 지수함수($\exp$)와 로그($\log$)가 상쇄되어 2차 다항식만 남으므로, 미분해서 0으로 두면 표본 평균과 표본 공분산이라는 깔끔한 닫힌 형태의 공식(closed-form formula)이 바로 튀어나왔습니다 (8장).
그러나 GMM에서는 **"로그 안에 합이 들어있는 구조(log of summation)"** 때문에 이 방법이 완전히 막히게 됩니다.

### 정의와 성질

#### 1. GMM의 결합 가능도 및 로그 가능도
데이터 $x_n$들이 독립항등분포(i.i.d.)를 따른다고 가정하면, 전체 결합 가능도는 각 데이터 밀도의 곱으로 분해됩니다 (교재 식 11.9):

$$p(\mathcal{X} \mid \theta) = \prod_{n=1}^N p(x_n \mid \theta) = \prod_{n=1}^N \sum_{k=1}^K \pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k)$$

양변에 자연로그를 취하여 로그 가능도(log-likelihood) $\mathcal{L}$을 구합니다 (교재 식 11.10):

$$\mathcal{L}(\theta) := \log p(\mathcal{X} \mid \theta) = \sum_{n=1}^N \log \left( \sum_{k=1}^K \pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k) \right)$$

#### 2. 왜 닫힌 형태의 해(Closed-form solution)가 불가능한가?
단일 가우시안($K=1$)일 때는 합 기호($\sum_{k}$)가 없으므로:
$$\log \mathcal{N}(x \mid \mu, \Sigma) = -\frac{D}{2}\log(2\pi) - \frac{1}{2}\log\det(\Sigma) - \frac{1}{2}(x-\mu)^\top \Sigma^{-1} (x-\mu)$$
로그가 지수함수 속으로 직접 파고들어 $\mu$와 $\Sigma$에 대한 단순한 2차 형식이 됩니다.
하지만 $K \ge 2$인 GMM에서는:
$$\log \left( \sum_{k=1}^K \dots \right)$$
로그가 덧셈 바깥에 가로막혀 있어서 지수함수와 직접 상쇄되지 않습니다! 연쇄법칙으로 미분을 시도하면 분모에 다시 전체 합이 나타나게 되어 모든 모수들이 서로 복잡하게 얽히게 됩니다.

#### 3. 최적성 필요조건 (Necessary Conditions)
극값(local optimum)에서는 각 모수에 대한 편미분이 $0$이 되어야 합니다:
$$\frac{\partial \mathcal{L}}{\partial \mu_k} = \mathbf{0}^\top, \quad \frac{\partial \mathcal{L}}{\partial \Sigma_k} = \mathbf{0}, \quad \frac{\partial \mathcal{L}}{\partial \pi_k} = 0$$

합의 로그 미분을 위해 연쇄법칙을 적용하면 (교재 식 11.15):
$$\frac{\partial}{\partial \theta} \log p(x_n \mid \theta) = \frac{1}{p(x_n \mid \theta)} \frac{\partial p(x_n \mid \theta)}{\partial \theta}$$
여기서 $\frac{1}{p(x_n \mid \theta)} = \frac{1}{\sum_{j=1}^K \pi_j \mathcal{N}(x_n \mid \mu_j, \Sigma_j)}$ 입니다.

---

### 11.2.1 책임도(Responsibilities, 352~353쪽)

#### 정의
위 미분 과정에서 분모와 분자의 비로 자연스럽게 등장하는 핵심 물리량이 바로 **책임도(responsibility)** $r_{nk}$입니다 (교재 식 11.17):

$$r_{nk} := \frac{\pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_n \mid \mu_j, \Sigma_j)}$$

#### 성질과 직관
1. **사후확률(Posterior Probability)**: $r_{nk}$는 데이터 $x_n$이 주어졌을 때, 이 데이터가 $k$번째 가우시안 성분에서 생성되었을 확률 $p(z_n = k \mid x_n)$을 의미합니다.
2. **확률 벡터(Probability Vector)**: 각 데이터 $n$에 대해 모든 성분의 책임도의 합은 정확히 1입니다:
   $$\sum_{k=1}^K r_{nk} = 1, \quad r_{nk} \ge 0$$
   따라서 벡터 $r_n := [r_{n1}, r_{n2}, \dots, r_{nK}]^\top \in \mathbb{R}^K$는 하나의 확률분포를 이룹니다.
3. **소프트 할당(Soft Assignment)**: K-평균 군집화처럼 데이터를 어느 한 클러스터에 100% 귀속시키는 '하드 할당(hard assignment)'과 달리, GMM은 "성분 1에 80%, 성분 2에 20%"와 같이 지분을 유연하게 나누어 갖습니다.
4. **유효 데이터 개수 $N_k$**:
   $$N_k := \sum_{n=1}^N r_{nk}$$
   $N_k$는 $k$번째 성분이 전체 데이터셋에 대해 지고 있는 총 책임도의 합이며, 사실상 **"$k$번째 가우시안 클러스터에 배정된 유효 데이터 개수(effective number of points)"**를 뜻합니다. $\sum_{k=1}^K N_k = N$이 성립합니다.

---

### 11.2.2 평균 벡터 갱신(Updating the Means, 353~355쪽)

#### 정리 11.1 (평균 갱신 공식)
책임도 $r_{nk}$가 주어졌을 때, 로그 가능도를 최대화하는 새로운 평균 벡터 $\mu_k^{\text{new}}$는 다음과 같습니다:

$$\mu_k^{\text{new}} = \frac{\sum_{n=1}^N r_{nk} x_n}{\sum_{n=1}^N r_{nk}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} x_n$$

#### 직관적 의미
이 식은 단순 산술평균이 아니라, 각 데이터 포인트 $x_n$에 책임도 $r_{nk}$를 가중치로 부여한 **가중 표본 평균(weighted sample mean)**입니다!
즉, $k$번째 가우시안은 자신과 가까워서 책임도 $r_{nk}$가 큰 데이터들을 강하게 끌어당겨 자신의 새로운 중심 $\mu_k$로 삼습니다 (교재 그림 11.4).

---

### 11.2.3 공분산 행렬 갱신(Updating the Covariances, 356~358쪽)

#### 정리 11.2 (공분산 갱신 공식)
책임도 $r_{nk}$와 갱신된 평균 $\mu_k$가 주어졌을 때, 새로운 공분산 행렬 $\Sigma_k^{\text{new}}$는 다음과 같습니다:

$$\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} (x_n - \mu_k)(x_n - \mu_k)^\top$$

#### 직관적 의미
중심 $\mu_k$를 기준으로 흩어진 정도를 나타내는 외적 행렬 $(x_n - \mu_k)(x_n - \mu_k)^\top$에 책임도 $r_{nk}$를 가중치로 곱하여 평균을 낸 **가중 표본 공분산(weighted sample covariance)**입니다.

---

### 11.2.4 혼합 가중치 갱신(Updating the Mixture Weights, 358~360쪽)

#### 정리 11.3 (혼합 가중치 갱신 공식)
등식 제약조건 $\sum_{k=1}^K \pi_k = 1$을 만족하면서 로그 가능도를 최대화하는 새로운 혼합 가중치 $\pi_k^{\text{new}}$는 다음과 같습니다:

$$\pi_k^{\text{new}} = \frac{N_k}{N} = \frac{1}{N} \sum_{n=1}^N r_{nk}$$

#### 직관적 의미
전체 데이터 개수 $N$ 중에서 $k$번째 클러스터가 책임지고 있는 유효 데이터 개수 $N_k$의 비율입니다. 즉, $k$번째 가우시안 성분의 **상대적 중요도(relative importance)**를 나타냅니다.

---

### 손으로 풀어 보는 예제 (1차원 데이터 3개로 EM 1단계 완전 손계산)
이 부분은 시험장에서 직접 손으로 계산할 수 있도록, 소수점 계산 과정을 하나하나 완벽하게 전개합니다.

**설정**:
- 데이터셋: 1차원 데이터 3개 $\mathcal{X} = \{x_1 = -1.0, \, x_2 = 1.0, \, x_3 = 4.0\}$ ($N=3$)
- 성분 개수: $K = 2$
- 초기 모수:
  - 성분 1: $\pi_1 = 0.5, \quad \mu_1 = 0.0, \quad \sigma_1^2 = 1.0$
  - 성분 2: $\pi_2 = 0.5, \quad \mu_2 = 3.0, \quad \sigma_2^2 = 1.0$

정규분포 확률밀도 공식: $\mathcal{N}(x \mid \mu, \sigma^2) = \frac{1}{\sqrt{2\pi \sigma^2}} \exp\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)$  
$\sigma = 1.0$이므로 $\frac{1}{\sqrt{2\pi}} \approx 0.39894$ 입니다.

#### 1단계: E-Step (책임도 $r_{nk}$ 계산)

- **데이터 1 ($x_1 = -1.0$)**:
  - 성분 1과의 거리: $(x_1 - \mu_1)^2 = (-1.0 - 0.0)^2 = 1.0 \implies \exp(-0.5) \approx 0.60653$
    $$\mathcal{N}(x_1 \mid \mu_1, \sigma_1^2) = 0.39894 \times 0.60653 \approx 0.24197$$
  - 성분 2와의 거리: $(x_1 - \mu_2)^2 = (-1.0 - 3.0)^2 = 16.0 \implies \exp(-8.0) \approx 0.000335$
    $$\mathcal{N}(x_1 \mid \mu_2, \sigma_2^2) = 0.39894 \times 0.000335 \approx 0.00013$$
  - 가중 밀도: $\pi_1 \mathcal{N}_1 = 0.5 \times 0.24197 = 0.12099$, $\pi_2 \mathcal{N}_2 = 0.5 \times 0.00013 = 0.00007$
  - 정규화 합: $0.12099 + 0.00007 = 0.12106$
  - 책임도:
    $$r_{11} = \frac{0.12099}{0.12106} \approx 0.9994, \quad r_{12} = \frac{0.00007}{0.12106} \approx 0.0006$$

- **데이터 2 ($x_2 = 1.0$)**:
  - 성분 1과의 거리: $(1.0 - 0.0)^2 = 1.0 \implies \exp(-0.5) \approx 0.60653 \implies \mathcal{N}_1 \approx 0.24197$
  - 성분 2와의 거리: $(1.0 - 3.0)^2 = 4.0 \implies \exp(-2.0) \approx 0.13534$
    $$\mathcal{N}(x_2 \mid \mu_2, \sigma_2^2) = 0.39894 \times 0.13534 \approx 0.05399$$
  - 가중 밀도 합: $0.5 \times (0.24197 + 0.05399) = 0.5 \times 0.29596 = 0.14798$
  - 책임도:
    $$r_{21} = \frac{0.5 \times 0.24197}{0.14798} = \frac{0.24197}{0.29596} \approx 0.8176, \quad r_{22} = \frac{0.05399}{0.29596} \approx 0.1824$$

- **데이터 3 ($x_3 = 4.0$)**:
  - 성분 1과의 거리: $(4.0 - 0.0)^2 = 16.0 \implies \mathcal{N}_1 \approx 0.00013$
  - 성분 2와의 거리: $(4.0 - 3.0)^2 = 1.0 \implies \mathcal{N}_2 \approx 0.24197$
  - 대칭성에 의해:
    $$r_{31} \approx 0.0006, \quad r_{32} \approx 0.9994$$

- **책임도 행렬 $R \in \mathbb{R}^{3 \times 2}$ 요약**:
  $$R = \begin{bmatrix} r_{11} & r_{12} \\ r_{21} & r_{22} \\ r_{31} & r_{32} \end{bmatrix} = \begin{bmatrix} 0.9994 & 0.0006 \\ 0.8176 & 0.1824 \\ 0.0006 & 0.9994 \end{bmatrix}$$

#### 2단계: M-Step (모수 갱신)

1. **유효 데이터 수 $N_k$ 계산**:
   $$N_1 = r_{11} + r_{21} + r_{31} = 0.9994 + 0.8176 + 0.0006 = 1.8176$$
   $$N_2 = r_{12} + r_{22} + r_{32} = 0.0006 + 0.1824 + 0.9994 = 1.1824$$
   (검산: $N_1 + N_2 = 1.8176 + 1.1824 = 3.0000 = N$)

2. **새로운 평균 $\mu_k^{\text{new}}$ 계산**:
   $$\begin{aligned}
   \mu_1^{\text{new}} &= \frac{r_{11} x_1 + r_{21} x_2 + r_{31} x_3}{N_1} \\
   &= \frac{0.9994(-1.0) + 0.8176(1.0) + 0.0006(4.0)}{1.8176} \\
   &= \frac{-0.9994 + 0.8176 + 0.0024}{1.8176} = \frac{-0.1794}{1.8176} \approx -0.0987 \approx -0.099
   \end{aligned}$$

   $$\begin{aligned}
   \mu_2^{\text{new}} &= \frac{r_{12} x_1 + r_{22} x_2 + r_{32} x_3}{N_2} \\
   &= \frac{0.0006(-1.0) + 0.1824(1.0) + 0.9994(4.0)}{1.1824} \\
   &= \frac{-0.0006 + 0.1824 + 3.9976}{1.1824} = \frac{4.1794}{1.1824} \approx 3.5347 \approx 3.535
   \end{aligned}$$

3. **새로운 분산 $(\sigma_k^2)^{\text{new}}$ 계산**:
   - 성분 1의 편차 제곱:
     - $(x_1 - \mu_1^{\text{new}})^2 = (-1.0 - (-0.0987))^2 = (-0.9013)^2 \approx 0.8123$
     - $(x_2 - \mu_1^{\text{new}})^2 = (1.0 - (-0.0987))^2 = (1.0987)^2 \approx 1.2071$
     - $(x_3 - \mu_1^{\text{new}})^2 = (4.0 - (-0.0987))^2 = (4.0987)^2 \approx 16.7993$
     $$(\sigma_1^2)^{\text{new}} = \frac{0.9994(0.8123) + 0.8176(1.2071) + 0.0006(16.7993)}{1.8176} = \frac{0.8118 + 0.9869 + 0.0101}{1.8176} = \frac{1.8088}{1.8176} \approx 0.995$$

   - 성분 2의 편차 제곱:
     - $(x_1 - \mu_2^{\text{new}})^2 = (-1.0 - 3.5347)^2 = (-4.5347)^2 \approx 20.5635$
     - $(x_2 - \mu_2^{\text{new}})^2 = (1.0 - 3.5347)^2 = (-2.5347)^2 \approx 6.4247$
     - $(x_3 - \mu_2^{\text{new}})^2 = (4.0 - 3.5347)^2 = (0.4653)^2 \approx 0.2165$
     $$(\sigma_2^2)^{\text{new}} = \frac{0.0006(20.5635) + 0.1824(6.4247) + 0.9994(0.2165)}{1.1824} = \frac{0.0123 + 1.1719 + 0.2164}{1.1824} = \frac{1.4006}{1.1824} \approx 1.184$$

4. **새로운 혼합 가중치 $\pi_k^{\text{new}}$ 계산**:
   $$\pi_1^{\text{new}} = \frac{N_1}{N} = \frac{1.8176}{3} \approx 0.6059$$
   $$\pi_2^{\text{new}} = \frac{N_2}{N} = \frac{1.1824}{3} \approx 0.3941$$
   (검산: $0.6059 + 0.3941 = 1.0000$)

**해석**:
초기 평균 $\mu_1 = 0$은 음수 데이터 $x_1=-1$ 쪽으로 끌려가 $-0.099$로 이동했고, 초기 평균 $\mu_2 = 3$은 큰 양수 데이터 $x_3=4$ 쪽으로 끌려가 $3.535$로 이동했습니다. 또한 데이터 3개 중 2개($-1$과 $1$)가 성분 1에 더 가깝기 때문에 성분 1의 비중 $\pi_1$이 $0.5$에서 약 $0.606$으로 증가했습니다. 단 한 번의 반복만으로도 모델이 데이터의 분포에 매우 민감하게 적응함을 확인할 수 있습니다.

### 헷갈리는 점 / 자주 하는 실수
- **분산 갱신 시 어떤 평균을 쓰는가?**:
  - 교재 식 (11.55) 우측 마진 주석에 명시되어 있듯이: M-step에서 $\mu_k$를 먼저 갱신한 후, 공분산 $\Sigma_k$를 계산할 때는 **새롭게 갱신된 평균 $\mu_k^{\text{new}}$를 사용**하는 것이 표준적인 구현입니다.
- **분모가 $N$이 아니라 $N_k$인 이유**:
  - 일반 표본 분산 공식에서는 데이터 총 개수 $N$으로 나누지만, GMM의 성분별 공분산에서는 $k$번째 성분에 할당된 유효 가중치 합 $N_k$로 나누어야 가중 평균의 총합이 1로 정규화됩니다.

---

## 11.3 EM 알고리즘(EM Algorithm, 360~363쪽)

### 왜 필요한가 (직관)
앞 절에서 우리는 아주 기묘한 순환 논리(circular dependency)를 목격했습니다:
- 모수 $(\mu_k, \Sigma_k, \pi_k)$를 알면 $\implies$ 책임도 $r_{nk}$를 완벽히 계산할 수 있다.
- 책임도 $r_{nk}$를 알면 $\implies$ 갱신 공식(정리 11.1~11.3)을 통해 모수를 완벽히 계산할 수 있다.
- **하지만 우리는 둘 다 모른다!**

닭이 먼저냐 달걀이 먼저냐 하는 이 문제를 푸는 가장 우아한 방법이 바로 **교대 최적화(coordinate ascent / alternating optimization)**입니다. 한쪽을 고정하고 다른 쪽을 구한 뒤, 구한 값으로 다시 첫 번째 것을 갱신하는 과정을 반복하면, 로그 가능도가 매 단계마다 반드시 증가(또는 유지)하며 국소 최적해(local optimum)로 수렴한다는 것이 증명되어 있습니다 (Dempster et al., 1977; Neal and Hinton, 1999).

### 정의와 성질

#### GMM을 위한 EM 알고리즘의 구체적 절차
1. **초기화(Initialization)**:
   모수 $\mu_k^{(0)}, \Sigma_k^{(0)}, \pi_k^{(0)}$를 초기화합니다 ($k=1, \dots, K$). (실무에서는 K-means를 먼저 실행한 중심점을 초기 $\mu_k$로 많이 사용함).
2. **E-단계(Expectation Step)**:
   현재 모수 추정값을 고정하고, 각 데이터 $x_n$에 대해 $k$번째 성분이 갖는 책임도 $r_{nk}$를 계산합니다 (교재 식 11.53):
   $$r_{nk} = \frac{\pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_n \mid \mu_j, \Sigma_j)}$$
3. **M-단계(Maximization Step)**:
   E-단계에서 계산된 책임도 $r_{nk}$를 가중치로 고정하고, 로그 가능도를 최대화하도록 모수를 재추정합니다 (교재 식 11.54~11.56):
   $$N_k = \sum_{n=1}^N r_{nk}$$
   $$\mu_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} x_n$$
   $$\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} (x_n - \mu_k^{\text{new}})(x_n - \mu_k^{\text{new}})^\top$$
   $$\pi_k^{\text{new}} = \frac{N_k}{N}$$
4. **수렴 판정(Convergence Check)**:
   로그 가능도 $\mathcal{L}(\theta)$의 변화량 $|\mathcal{L}^{(t+1)} - \mathcal{L}^{(t)}| < \epsilon$ 이거나 모수의 변화량이 임계값 이하이면 종료하고, 그렇지 않으면 2단계로 돌아갑니다.

#### 핵심 이론적 성질
- **로그 가능도의 단조 증가성**:
  $$\mathcal{L}(\theta^{(t+1)}) \ge \mathcal{L}(\theta^{(t)})$$
  EM 알고리즘의 모든 반복은 로그 가능도를 결코 감소시키지 않습니다.
- **국소 최적해(Local Optimum)**:
  EM 알고리즘은 전역 최적해(global optimum)로의 수렴을 보장하지 않습니다. 초기값 설정에 따라 서로 다른 국소 극대점에 도달할 수 있으므로, 서로 다른 무작위 초기화로 여러 번 실행하는 전략이 권장됩니다.

### 손으로 풀어 보는 예제 (수렴 여부 판단)
반복 $t$에서 음의 로그 가능도(Negative Log-Likelihood, NLL)가 다음과 같이 측정되었다고 합시다:
- $t=0$: $\text{NLL} = 28.3$
- $t=1$: $\text{NLL} = 14.4$
- $t=2$: $\text{NLL} = 13.8$
- $t=3$: $\text{NLL} = 13.51$
- $t=4$: $\text{NLL} = 13.501$
- 수렴 기준 $\epsilon = 0.01$일 때:
  $|\text{NLL}^{(4)} - \text{NLL}^{(3)}| = |13.501 - 13.510| = 0.009 < 0.01$ 이므로 4회 반복에서 수렴 판정을 내리고 반복을 중단합니다.

### 헷갈리는 점 / 자주 하는 실수
- **EM은 경사하강법(Gradient Descent)인가?**:
  - 아닙니다! 경사하강법은 학습률(learning rate) $\gamma$를 사용자가 설정해야 하고 발산 위험이 있지만, EM 알고리즘은 닫힌 갱신식을 사용하므로 학습률 하이퍼파라미터가 없으며 매 단계 단조 증가가 수학적으로 보장됩니다.

---

## 11.4 잠재변수 관점(Latent-Variable Perspective, 363~367쪽)

### 왜 필요한가 (직관)
앞선 11.2절과 11.3절의 유도는 다소 직관적이고 임의적인(ad-hoc) 면이 있었습니다. "분모와 분자의 비를 책임도라고 이름 붙이고, 마치 가중치처럼 취급해서 교대로 풀자"는 방식이었기 때문입니다.
11.4절에서는 이를 매우 엄밀한 확률론의 틀로 끌어올립니다. 

우리가 관측한 데이터 $x_n$ 뒤에는 **"이 데이터가 과연 몇 번째 가우시안에서 태어났는가?"**를 가리키는 숨겨진 변수, 즉 **잠재변수(latent variable)** $z_n$이 존재한다고 생각하는 것입니다.
이 관점을 취하면:
1. 책임도 $r_{nk}$가 다름 아닌 잠재변수의 **사후확률 $p(z_{nk}=1 \mid x_n)$**임이 증명됩니다.
2. GMM뿐만 아니라 결측치가 있는 모든 확률 모델에 적용 가능한 일반적인 EM 알고리즘 이론($Q$-함수)이 자연스럽게 유도됩니다.

### 정의와 성질

#### 1. 1-of-K 표현 (One-Hot Encoding)
$K$개의 성분 중 단 하나만을 선택하는 이산 잠재변수 벡터 $z \in \mathbb{R}^K$를 정의합니다:
$$z = [z_1, z_2, \dots, z_K]^\top, \quad z_k \in \{0, 1\}, \quad \sum_{k=1}^K z_k = 1$$
예를 들어 $K=3$이고 데이터가 2번째 성분에서 생성되었다면 $z = [0, 1, 0]^\top$ 입니다. (이러한 분포를 범주형 분포 또는 다항분포의 특수형태인 'multinoulli'라고 부릅니다).

#### 2. 생성 과정 (Generative Process)
데이터 $x$가 만들어지는 과정은 다음과 같은 2단계 계층 모델(hierarchical model)입니다:
1. **잠재변수 표집**: 사전분포 $p(z)$에서 어떤 성분을 고를지 결정합니다:
   $$p(z_k = 1) = \pi_k \iff p(z) = \prod_{k=1}^K \pi_k^{z_k}$$
2. **조건부 관측치 표집**: 선택된 성분($z_k=1$)의 가우시안에서 데이터 $x$를 추출합니다:
   $$p(x \mid z_k = 1) = \mathcal{N}(x \mid \mu_k, \Sigma_k) \iff p(x \mid z) = \prod_{k=1}^K \mathcal{N}(x \mid \mu_k, \Sigma_k)^{z_k}$$

#### 3. 결합분포 및 주변 가능도 (Marginal Likelihood)
데이터와 잠재변수의 결합확률분포(joint distribution)는 다음과 같습니다 (교재 식 11.61):
$$p(x, z_k = 1) = p(x \mid z_k = 1) p(z_k = 1) = \pi_k \mathcal{N}(x \mid \mu_k, \Sigma_k)$$

우리가 실제로 관측하는 데이터 $x$의 주변분포(marginal distribution)는 보이지 않는 잠재변수 $z$의 모든 가능한 상태($K$가지의 일-핫 벡터)에 대해 합(marginalize out)을 취한 것입니다 (교재 식 11.63, 11.66):
$$p(x \mid \theta) = \sum_z p(x, z \mid \theta) = \sum_{k=1}^K p(x, z_k=1 \mid \theta) = \sum_{k=1}^K \pi_k \mathcal{N}(x \mid \mu_k, \Sigma_k)$$
이로써 앞서 11.1절에서 정의했던 GMM 식 (11.3)이 잠재변수 모델의 한계화(marginalization) 결과와 정확히 일치함이 입증됩니다!

#### 4. 사후분포로서의 책임도
베이즈 정리를 적용하여 관측치 $x$가 주어졌을 때 잠재변수 $z_k=1$일 사후확률을 계산하면 (교재 식 11.69):
$$p(z_k = 1 \mid x) = \frac{p(x, z_k = 1)}{p(x)} = \frac{\pi_k \mathcal{N}(x \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x \mid \mu_j, \Sigma_j)} \equiv r_k$$
따라서 **책임도는 다름 아닌 잠재변수 $z_k=1$의 베이지안 사후확률**입니다!

#### 5. 일반적 EM 알고리즘: $Q$-함수 (Expected Complete-Data Log-Likelihood)
모수 $\theta^{(t)}$가 주어졌을 때, 잠재변수 $z$의 사후분포 $p(z \mid x, \theta^{(t)})$ 하에서 **완전 데이터 로그 가능도(complete-data log-likelihood)** $\log p(x, z \mid \theta)$의 조건부 기댓값을 $Q$-함수라고 정의합니다 (교재 식 11.73):

$$Q(\theta \mid \theta^{(t)}) := \mathbb{E}_{z \mid x, \theta^{(t)}} [\log p(x, z \mid \theta)] = \sum_z p(z \mid x, \theta^{(t)}) \log p(x, z \mid \theta)$$

- **E-단계**: 현재 모수 $\theta^{(t)}$를 이용해 사후분포 $p(z \mid x, \theta^{(t)}) = r_{nk}$를 구하고 $Q(\theta \mid \theta^{(t)})$ 함수를 구성합니다.
- **M-단계**: 이 $Q$-함수를 새로운 모수 $\theta$에 대해 최대화하여 $\theta^{(t+1)}$을 얻습니다:
  $$\theta^{(t+1)} = \arg\max_\theta Q(\theta \mid \theta^{(t)})$$

### 손으로 풀어 보는 예제 (일-핫 벡터와 기대값 계산)
$K=2$일 때, 어떤 점 $x_n$에 대해 E-단계에서 구한 사후확률이 $p(z_{n1}=1 \mid x_n) = 0.7$, $p(z_{n2}=1 \mid x_n) = 0.3$이라고 하자.
잠재변수 $z_n = [z_{n1}, z_{n2}]^\top$의 기댓값 $\mathbb{E}[z_n]$을 구하시오.

**풀이**:
$z_{n1}$은 확률 0.7로 1, 확률 0.3으로 0을 갖는 베르누이 확률변수이므로:
$$\mathbb{E}[z_{n1}] = 1 \times 0.7 + 0 \times 0.3 = 0.7$$
$$\mathbb{E}[z_{n2}] = 1 \times 0.3 + 0 \times 0.7 = 0.3$$
따라서 $\mathbb{E}[z_n] = [0.7, 0.3]^\top = [r_{n1}, r_{n2}]^\top$.
즉, **잠재 지시변수의 기댓값은 정확히 책임도 벡터와 같다**는 기본 성질을 손계산으로 바로 확인할 수 있습니다.

### 헷갈리는 점 / 자주 하는 실수
- **관측 데이터 가능도 vs 완전 데이터 가능도**:
  - 관측 데이터 가능도 $\log p(x \mid \theta) = \log \sum_z p(x, z \mid \theta)$는 로그 안에 합이 있어서 최적화가 극도로 어렵습니다.
  - 완전 데이터 가능도 $\log p(x, z \mid \theta) = \sum_k z_k \log [\pi_k \mathcal{N}(x \mid \mu_k, \Sigma_k)]$는 $z$가 지수에 있던 것이 로그 앞으로 내려오면서 **합의 로그가 사라지고 로그의 합만 남아 닫힌 형태로 쉽게 최대화**됩니다. EM은 바로 이 완전 데이터 가능도의 기댓값을 최적화하는 기법입니다.

---

## 11.5 더 읽을거리(Further Reading, 368~369쪽)

### 왜 필요한가 (직관)
GMM과 EM 알고리즘을 배웠다면, 머신러닝의 다른 핵심 알고리즘들과 어떻게 연결되는지, 그리고 실무에서 마주치는 한계점과 대안은 무엇인지 시야를 넓혀야 합니다.

### 정의와 핵심 성질

#### 1. 조상 표집 (Ancestral Sampling)
GMM은 데이터의 밀도를 추정할 뿐만 아니라, 새로운 가상의 데이터를 무한히 생성할 수 있는 **생성 모델(Generative Model)**입니다.
- 1단계: 혼합 가중치 확률벡터 $[\pi_1, \dots, \pi_K]^\top$에 따라 성분 인덱스 $k \sim \text{Cat}(\pi)$를 하나 뽑습니다.
- 2단계: 선택된 가우시안 분포 $\mathcal{N}(\mu_k, \Sigma_k)$에서 데이터 $x_{\text{new}}$를 뽑습니다.
- 이 과정을 $N$번 반복하면 GMM으로부터 완벽한 표본 데이터셋을 얻을 수 있습니다.

#### 2. K-평균 군집화(K-Means)와의 관계 (11.5절)
**교재 서술:** GMM의 평균을 군집 중심으로 보고 **공분산은 무시하거나 $I$로 고정**하면 K-평균이 된다. K-평균도 EM처럼 "할당 ↔ 중심 갱신"을 반복하지만, 데이터를 중심에 **하드(hard) 할당**하고 GMM은 책임도로 **소프트(soft) 할당**한다는 점이 다르다.

**(교재 밖 보충) 극한으로 보는 방법:** 모든 공분산을 $\Sigma_k = \sigma^2 I$로 두고 $\sigma^2 \to 0$ 극한을 취하면, 가장 가까운 중심의 책임도는 1, 나머지는 0이 된다:
$$r_{nk} \to \begin{cases} 1 & \text{if } k = \arg\min_j \|x_n - \mu_j\|^2 \\ 0 & \text{otherwise} \end{cases}$$
이것이 K-평균의 **하드 할당(hard assignment)**과 같다(Bishop 교재 등에서 쓰는 설명이다).

#### 3. 최대가능도의 치명적 한계: 특이성(Singularity / Covariance Collapsing)
GMM을 MLE로 학습할 때 매우 위험한 현상이 발생할 수 있습니다.
만약 어떤 가우시안 성분 $k$의 중심 $\mu_k$가 우연히 데이터 포인트 중 하나인 $x_n$과 정확히 일치하게 되고($\mu_k = x_n$), 그 성분의 분산 $\sigma_k^2 \to 0$으로 수렴하면:
$$\mathcal{N}(x_n \mid x_n, \sigma_k^2) = \frac{1}{\sqrt{2\pi \sigma_k^2}} \exp(0) \to \infty$$
전체 로그 가능도가 $+\infty$로 발산해 버립니다!
이를 **특이성(singularity)** 또는 **공분산 붕괴(covariance collapsing)**라고 부르며, MLE가 과적합(overfitting)에 극도로 취약함을 보여줍니다. 
- *해결책*: 모수에 사전분포(Conjugate Prior)를 부여하는 베이지안 GMM(Bayesian GMM)이나 변분 추론(Variational Inference)을 사용하거나, 공분산 행렬 대각선에 작은 양수 $\epsilon I$를 더해주는 정규화(ridge regularization)를 적용합니다.

#### 4. 비모수 밀도 추정과의 비교: 히스토그램과 커널 밀도 추정 (KDE, 교재 식 11.74)
- **히스토그램(Histogram)**: 구간(bin)을 나누어 빈도를 세는 방식. 구간 너비(bin width)에 극도로 민감하며 불연속적인 계단 모양이 됨.
- **커널 밀도 추정(Kernel Density Estimation, KDE)**: 모든 데이터 포인트 $x_n$마다 부드러운 커널 함수 $k(\cdot)$를 얹어 합치는 비모수적 기법:
  $$p(x) = \frac{1}{N h} \sum_{n=1}^N k\left( \frac{x - x_n}{h} \right)$$
  - $h > 0$: 대역폭(bandwidth, 평활화 매개변수).
  - GMM과의 차이: GMM은 모수의 개수가 $K$개로 고정된 **모수적 모델(parametric model)**이지만, KDE는 데이터가 늘어날 때마다 커널의 개수가 데이터 수 $N$만큼 함께 늘어나는 **비모수적 모델(nonparametric model)**입니다.

---

## 핵심 유도 모음 (백지에 직접 쓸 수 있어야 하는 유도)

시험 준비를 위해 유도 과정의 모든 단계를 생략 없이, 각 줄마다 근거를 명시하여 정리합니다.

### 유도 1: GMM 평균 갱신식 유도 (Theorem 11.1)

**목표**: 로그 가능도 $\mathcal{L}(\theta) = \sum_{n=1}^N \log p(x_n \mid \theta)$를 $\mu_k$에 대해 편미분하여 $0$으로 놓고 $\mu_k^{\text{new}}$를 구한다.

1. **로그 미분 연쇄법칙 적용**:
   $$\frac{\partial \mathcal{L}}{\partial \mu_k} = \sum_{n=1}^N \frac{1}{p(x_n \mid \theta)} \frac{\partial p(x_n \mid \theta)}{\partial \mu_k}$$
   *(이유: $\frac{d}{du}\log(u) = \frac{1}{u}$ 이고 연쇄법칙 적용)*

2. **혼합 밀도의 편미분 전개**:
   $$p(x_n \mid \theta) = \sum_{j=1}^K \pi_j \mathcal{N}(x_n \mid \mu_j, \Sigma_j)$$ 이므로, $\mu_k$에 의존하는 항은 오직 $j=k$인 성분뿐이다:
   $$\frac{\partial p(x_n \mid \theta)}{\partial \mu_k} = \pi_k \frac{\partial \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\partial \mu_k}$$

3. **가우시안 확률밀도의 평균에 대한 미분**:
   $\mathcal{N}(x_n \mid \mu_k, \Sigma_k) = \frac{1}{(2\pi)^{D/2}|\Sigma_k|^{1/2}} \exp\left(-\frac{1}{2}(x_n - \mu_k)^\top \Sigma_k^{-1} (x_n - \mu_k)\right)$
   지수 부분의 미분: $\frac{\partial}{\partial \mu_k} \left[ -\frac{1}{2}(x_n - \mu_k)^\top \Sigma_k^{-1} (x_n - \mu_k) \right] = (x_n - \mu_k)^\top \Sigma_k^{-1}$
   따라서:
   $$\frac{\partial \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\partial \mu_k} = (x_n - \mu_k)^\top \Sigma_k^{-1} \mathcal{N}(x_n \mid \mu_k, \Sigma_k)$$

4. **전체 식 결합 및 책임도 $r_{nk}$ 출현**:
   $$\frac{\partial \mathcal{L}}{\partial \mu_k} = \sum_{n=1}^N \frac{\pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_n \mid \mu_j, \Sigma_j)} (x_n - \mu_k)^\top \Sigma_k^{-1}$$
   앞부분의 분수식은 정확히 책임도 $r_{nk}$의 정의(식 11.17)이다:
   $$\frac{\partial \mathcal{L}}{\partial \mu_k} = \sum_{n=1}^N r_{nk} (x_n - \mu_k)^\top \Sigma_k^{-1}$$

5. **$0^\top$으로 놓고 $\mu_k$에 대해 풀기**:
   양변에 우측으로 $\Sigma_k$를 곱하면 역행렬이 소거된다:
   $$\sum_{n=1}^N r_{nk} (x_n - \mu_k)^\top = \mathbf{0}^\top \iff \sum_{n=1}^N r_{nk} x_n = \sum_{n=1}^N r_{nk} \mu_k$$
   $\mu_k$는 합산 인덱스 $n$에 무관한 상수 벡터이므로 밖으로 뺀다:
   $$\left(\sum_{n=1}^N r_{nk}\right) \mu_k = \sum_{n=1}^N r_{nk} x_n$$
   양변을 $N_k := \sum_{n=1}^N r_{nk}$ 로 나누면:
   $$\mu_k^{\text{new}} = \frac{\sum_{n=1}^N r_{nk} x_n}{\sum_{n=1}^N r_{nk}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} x_n \quad \blacksquare$$

---

### 유도 2: GMM 공분산 행렬 갱신식 유도 (Theorem 11.2)

**필요한 행렬 미분 기본 공식 (교재 5장)**:
- 공식 1: $\frac{\partial}{\partial A} \log \det(A) = A^{-\top} = A^{-1}$ ($A$가 대칭일 때) $\implies \frac{\partial}{\partial \Sigma} \det(\Sigma)^{-1/2} = -\frac{1}{2} \det(\Sigma)^{-1/2} \Sigma^{-1}$ (교재 식 5.101)
- 공식 2: $\frac{\partial}{\partial A} (x^\top A^{-1} x) = -A^{-1} x x^\top A^{-1}$ (교재 식 5.103)

**유도 단계**:
1. 가우시안 밀도 $\mathcal{N}_n := \mathcal{N}(x_n \mid \mu_k, \Sigma_k) = (2\pi)^{-D/2} \det(\Sigma_k)^{-1/2} \exp\left(-\frac{1}{2}(x_n-\mu_k)^\top \Sigma_k^{-1} (x_n-\mu_k)\right)$의 $\Sigma_k$에 대한 편미분:
   곱의 미분법을 적용하면:
   $$\begin{aligned}
   \frac{\partial \mathcal{N}_n}{\partial \Sigma_k} &= (2\pi)^{-D/2} \left[ \left(-\frac{1}{2} \det(\Sigma_k)^{-1/2} \Sigma_k^{-1}\right) \exp(\dots) + \det(\Sigma_k)^{-1/2} \exp(\dots) \left(-\frac{1}{2} \left(-\Sigma_k^{-1}(x_n-\mu_k)(x_n-\mu_k)^\top \Sigma_k^{-1}\right)\right) \right] \\
   &= -\frac{1}{2} \mathcal{N}_n \left[ \Sigma_k^{-1} - \Sigma_k^{-1} (x_n - \mu_k)(x_n - \mu_k)^\top \Sigma_k^{-1} \right]
   \end{aligned}$$

2. 로그 가능도의 편미분에 대입:
   $$\frac{\partial \mathcal{L}}{\partial \Sigma_k} = \sum_{n=1}^N \frac{1}{p(x_n \mid \theta)} \pi_k \frac{\partial \mathcal{N}_n}{\partial \Sigma_k} = -\frac{1}{2} \sum_{n=1}^N r_{nk} \left[ \Sigma_k^{-1} - \Sigma_k^{-1} (x_n - \mu_k)(x_n - \mu_k)^\top \Sigma_k^{-1} \right]$$

3. 식을 정리하고 $0$으로 놓기:
   $$-\frac{1}{2} \Sigma_k^{-1} \left( \sum_{n=1}^N r_{nk} \right) + \frac{1}{2} \Sigma_k^{-1} \left( \sum_{n=1}^N r_{nk} (x_n - \mu_k)(x_n - \mu_k)^\top \right) \Sigma_k^{-1} = \mathbf{0}$$
   $N_k := \sum_{n=1}^N r_{nk}$ 이므로, 양변의 좌측에 $\Sigma_k$, 우측에 $\Sigma_k$를 곱하면:
   $$N_k \Sigma_k = \sum_{n=1}^N r_{nk} (x_n - \mu_k)(x_n - \mu_k)^\top$$
   양변을 $N_k$로 나누면:
   $$\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} (x_n - \mu_k)(x_n - \mu_k)^\top \quad \blacksquare$$

---

### 유도 3: 혼합 가중치 $\pi_k$ 갱신식 유도 (Theorem 11.3)

**목표**: 제약조건 $\sum_{k=1}^K \pi_k = 1$ 하에서 $\mathcal{L}(\theta)$를 최대화한다.

1. **라그랑지안(Lagrangian) 함수 구성**:
   등식 제약조건에 대한 라그랑주 승수 $\lambda$를 도입한다 (교재 식 11.43):
   $$\Lambda(\pi, \lambda) = \sum_{n=1}^N \log \left( \sum_{k=1}^K \pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k) \right) + \lambda \left( \sum_{k=1}^K \pi_k - 1 \right)$$

2. **$\pi_k$에 대한 편미분 계산**:
   $$\frac{\partial \Lambda}{\partial \pi_k} = \sum_{n=1}^N \frac{\mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_n \mid \mu_j, \Sigma_j)} + \lambda = 0$$
   분모와 분자에 $\pi_k$를 곱해주면 책임도 $r_{nk}$가 나타난다:
   $$\frac{1}{\pi_k} \sum_{n=1}^N \frac{\pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_n \mid \mu_j, \Sigma_j)} + \lambda = 0 \iff \frac{1}{\pi_k} \sum_{n=1}^N r_{nk} + \lambda = 0$$
   $$\frac{N_k}{\pi_k} + \lambda = 0 \implies \pi_k = -\frac{N_k}{\lambda}$$

3. **승수 $\lambda$ 소거**:
   모든 $k=1, \dots, K$에 대해 합을 취하고 제약조건 $\sum_{k=1}^K \pi_k = 1$을 적용한다:
   $$\sum_{k=1}^K \pi_k = \sum_{k=1}^K \left(-\frac{N_k}{\lambda}\right) = -\frac{1}{\lambda} \sum_{k=1}^K N_k = 1$$
   그런데 $\sum_{k=1}^K N_k = \sum_{k=1}^K \sum_{n=1}^N r_{nk} = \sum_{n=1}^N \left(\sum_{k=1}^K r_{nk}\right) = \sum_{n=1}^N 1 = N$ 이다!
   따라서:
   $$-\frac{N}{\lambda} = 1 \implies \lambda = -N$$

4. **최종 갱신식 도출**:
   $\lambda = -N$을 $\pi_k = -\frac{N_k}{\lambda}$에 다시 대입하면:
   $$\pi_k^{\text{new}} = \frac{N_k}{N} \quad \blacksquare$$

---

## 말로 설명하기 (개념 서술형·구술 대비)

서술형 문항이나 구술 질문에 대비해 말로도 설명해 본다.

**Q. GMM이 무엇이고 왜 쓰나요?**
"가우시안 여러 개를 가중치 $\pi_k$로 섞은 밀도 $\sum_k\pi_k\mathcal N(x\mid\mu_k,\Sigma_k)$입니다. 가중치는 음수가 아니고 합이 1이라 결과도 확률밀도입니다. 가우시안 하나로는 봉우리가 하나뿐이라, 여러 집단이 섞인 데이터의 밀도를 표현하려고 씁니다."

**Q. 왜 GMM은 최대가능도 해를 닫힌 형태로 못 구하나요?**
"로그가능도가 $\sum_n\log\sum_k\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)$처럼 로그 안에 합이 있어서, 미분하면 모든 성분의 모수가 분모에 얽힙니다. 단일 가우시안처럼 로그가 지수를 풀어 주지 못합니다. 그래서 책임도를 고정하고 모수를 갱신하는 일을 번갈아 반복하는 EM을 씁니다."

**Q. 책임도는 무엇인가요?**
"데이터 $x_n$이 $k$번째 성분에서 나왔을 사후확률 $p(z_{nk}=1\mid x_n)=\frac{\pi_k\mathcal N(x_n\mid\mu_k,\Sigma_k)}{\sum_j\pi_j\mathcal N(x_n\mid\mu_j,\Sigma_j)}$입니다. 데이터마다 합이 1이고, 데이터를 성분들에 나눠 주는 소프트 할당 역할을 합니다."

**Q. EM 알고리즘의 두 단계를 설명해 보세요.**
"E-step에서 현재 모수로 책임도를 계산하고, M-step에서 책임도를 가중치로 삼아 평균(가중 평균), 공분산(가중 공분산), 혼합 가중치($N_k/N$)를 다시 계산합니다. 반복할 때마다 로그가능도가 줄지 않고 국소 최적점으로 수렴합니다. 전역 최적은 보장되지 않아 초기값이 중요합니다."

**Q. 혼합 가중치 갱신식은 어떻게 유도하나요?**
"$\sum_k\pi_k=1$이라는 제약이 있어 라그랑주 승수를 씁니다. 라그랑지안을 $\pi_k$로 미분하면 $N_k/\pi_k+\lambda=0$이고, 모든 $k$에 대해 더해 제약을 쓰면 $\lambda=-N$이 나와 $\pi_k=N_k/N$이 됩니다."

**Q. 잠재변수 관점에서 GMM을 설명해 보세요.**
"원-핫 잠재변수 $z$를 먼저 $p(z_k=1)=\pi_k$로 뽑고, 고른 성분의 가우시안에서 $x$를 뽑는 생성 모델입니다. $z$를 주변화하면 GMM 밀도가 되고, 베이즈 정리로 구한 $z$의 사후확률이 책임도입니다. 이렇게 보면 EM은 완전 데이터 로그가능도의 기댓값 $Q(\theta\mid\theta^{(t)})$를 최대화하는 일반 알고리즘입니다."

**Q. GMM과 K-평균의 차이는?**
"K-평균은 각 점을 가장 가까운 중심 하나에 하드 할당하고 중심만 갱신합니다. GMM은 책임도로 소프트 할당하고 공분산과 가중치까지 학습합니다. 교재는 GMM에서 공분산을 무시하거나 $I$로 두면 K-평균이 된다고 설명합니다."

---

## 연습문제

### 확인 문제 (계산형 및 개념형 10제)

#### [문제 1: 책임도 수치 계산]
1차원 GMM에서 $K=2$이고 $\pi_1 = 0.4, \pi_2 = 0.6$이다.
어떤 데이터 $x = 2$에 대해 두 가우시안의 확률밀도 값이 각각 $\mathcal{N}(x \mid \mu_1, \sigma_1^2) = 0.3$, $\mathcal{N}(x \mid \mu_2, \sigma_2^2) = 0.1$로 계산되었다. 
이 데이터에 대한 1번 성분의 책임도 $r_{1}$을 구하시오.

**[풀이]**
책임도 공식: $r_1 = \frac{\pi_1 \mathcal{N}_1}{\pi_1 \mathcal{N}_1 + \pi_2 \mathcal{N}_2}$
분자: $\pi_1 \mathcal{N}_1 = 0.4 \times 0.3 = 0.12$
분모: $0.4 \times 0.3 + 0.6 \times 0.1 = 0.12 + 0.06 = 0.18$
따라서:
$$r_1 = \frac{0.12}{0.18} = \frac{2}{3} \approx 0.6667$$

---

#### [문제 2: 평균 갱신 수치 계산]
데이터 3개 $x_1 = 0, x_2 = 2, x_3 = 6$이 주어져 있다.
어떤 성분 $k$에 대한 세 데이터의 책임도가 각각 $r_{1k} = 0.5, r_{2k} = 0.3, r_{3k} = 0.2$로 계산되었다.
이 성분의 유효 데이터 수 $N_k$와 갱신된 평균 $\mu_k^{\text{new}}$를 구하시오.

**[풀이]**
1. $N_k = \sum_{n=1}^3 r_{nk} = 0.5 + 0.3 + 0.2 = 1.0$
2. 가중 합: $\sum_{n=1}^3 r_{nk} x_n = (0.5 \times 0) + (0.3 \times 2) + (0.2 \times 6) = 0 + 0.6 + 1.2 = 1.8$
3. 평균 갱신:
   $$\mu_k^{\text{new}} = \frac{1.8}{1.0} = 1.8$$

---

#### [문제 3: 분산 갱신 수치 계산]
문제 2의 조건에서 갱신된 평균 $\mu_k^{\text{new}} = 1.8$을 사용하여, 이 성분의 갱신된 분산 $(\sigma_k^2)^{\text{new}}$를 구하시오.

**[풀이]**
각 데이터의 편차 제곱 $(x_n - \mu_k^{\text{new}})^2$:
- $n=1$: $(0 - 1.8)^2 = (-1.8)^2 = 3.24$
- $n=2$: $(2 - 1.8)^2 = (0.2)^2 = 0.04$
- $n=3$: $(6 - 1.8)^2 = (4.2)^2 = 17.64$

가중 합 계산:
$$\sum_{n=1}^3 r_{nk} (x_n - \mu_k^{\text{new}})^2 = (0.5 \times 3.24) + (0.3 \times 0.04) + (0.2 \times 17.64) = 1.62 + 0.012 + 3.528 = 5.16$$
$N_k = 1.0$ 이므로:
$$(\sigma_k^2)^{\text{new}} = \frac{5.16}{1.0} = 5.16$$

---

#### [문제 4: 단일 가우시안 MLE와 GMM MLE의 결정적 차이]
단일 가우시안 분포의 모수 추정에서는 닫힌 형태의 해(closed-form solution)가 존재하지만, GMM에서는 존재하지 않는 수학적 이유를 "로그(log)와 합(sum)의 위치 관계" 관점에서 서술하시오.

**[풀이]**
단일 가우시안에서는 로그 가능도가 $\sum_n \log \mathcal{N}(x_n \mid \mu, \Sigma)$ 형태이므로, 로그가 지수함수와 직접 만나 상쇄되어 모수 $\mu, \Sigma$에 대한 단순 2차 다항식이 된다. 따라서 미분하여 0으로 두면 모수에 대한 선형 방정식이 되어 즉시 풀린다.
반면 GMM에서는 로그 가능도가 $\sum_n \log \left( \sum_k \pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k) \right)$ 형태로서, 로그 연산자 내부에 합($\sum_k$)이 존재한다. 연쇄법칙으로 미분하면 분모에 다시 전체 합이 나타나게 되어, 특정 모수 $\mu_k$의 미분식에 다른 모든 성분의 모수들이 비선형적으로 복잡하게 결합되므로 닫힌 형태의 해를 구할 수 없다.

---

#### [문제 5: K-평균과 GMM의 수학적 연결]
GMM의 EM 알고리즘이 K-평균(K-means) 알고리즘으로 수렴하기 위해 필요한 두 가지 수학적 가정을 제시하고, 그 극한에서 책임도 $r_{nk}$가 어떻게 변화하는지 설명하시오.

**[풀이]**
두 가지 가정:
1. 모든 성분의 공분산 행렬이 동일한 구형 공분산이다: $\Sigma_k = \sigma^2 I$ ($k=1, \dots, K$).
2. 모든 성분의 혼합 가중치가 동일하다: $\pi_k = 1/K$.
이 상태에서 분산 $\sigma^2 \to 0$ 극한을 취하면, 유클리드 거리 $\|x_n - \mu_k\|^2$가 가장 작은 성분의 지수항이 다른 성분들에 비해 압도적으로 커지므로:
$$r_{nk} \to \begin{cases} 1 & \text{if } k = \arg\min_j \|x_n - \mu_j\|^2 \\ 0 & \text{otherwise} \end{cases}$$
즉, 소프트 할당(확률값)이 가장 가까운 중심점으로 100% 배정되는 하드 할당(hard assignment)으로 퇴화하여 K-평균 알고리즘과 같아진다. (교재 11.5절은 "평균만 군집 중심으로 보고 공분산을 무시하거나 $I$로 두면 K-평균"이라고만 설명한다. 극한 논증은 교재 밖 보충이다.)

---

#### [문제 6: GMM MLE의 특이성(Singularity) 문제]
GMM을 최대가능도(MLE)로 학습할 때 발생할 수 있는 '특이성(singularity)' 현상이란 무엇이며, 이것이 왜 발생하는지 수식으로 설명하시오.

**[풀이]**
어떤 가우시안 성분 $k$의 평균 $\mu_k$가 우연히 데이터셋의 특정 한 점 $x_j$와 완전히 일치하게 되고($\mu_k = x_j$), 그 성분의 공분산 $\Sigma_k = \sigma_k^2 I$의 분산이 0으로 수렴($\sigma_k^2 \to 0$)할 때 발생한다.
이때 해당 데이터 포인트에서의 확률밀도는:
$$\mathcal{N}(x_j \mid x_j, \sigma_k^2 I) = \frac{1}{(2\pi \sigma_k^2)^{D/2}} \exp(0) \to \infty$$
가 되어 전체 로그 가능도가 $+\infty$로 발산해 버린다. 이는 모델이 일반적인 데이터 분포를 학습하는 대신 단 하나의 데이터 포인트에 무한대의 밀도를 부여하여 과적합되는 현상이다.

---

#### [문제 7: 잠재 지시변수 $z$의 사전분포와 조건부 분포]
$K$개의 성분을 가진 GMM에서 일-핫 벡터 잠재변수 $z \in \{0, 1\}^K$ ($\sum_k z_k = 1$)를 도입할 때,
사전분포 $p(z)$와 관측치 조건부 분포 $p(x \mid z)$를 곱셈 기호($\prod$)를 사용하여 컴팩트한 단일 수식으로 나타내시오.

**[풀이]**
1. 사전분포:
   $$p(z) = \prod_{k=1}^K \pi_k^{z_k}$$
   ($z$에서 단 하나의 $z_k$만 1이고 나머지는 0이므로, $z_k=1$일 때 정확히 $\pi_k$가 됨)
2. 조건부 분포:
   $$p(x \mid z) = \prod_{k=1}^K \mathcal{N}(x \mid \mu_k, \Sigma_k)^{z_k}$$

---

#### [문제 8: 라그랑주 승수 $\lambda$의 값 유도]
GMM 혼합 가중치 $\pi_k$ 유도 과정에서 목적함수 $\Lambda = \mathcal{L} + \lambda (\sum_k \pi_k - 1)$를 최적화할 때, 라그랑주 승수 $\lambda$의 값이 정확히 $-N$ ($N$은 데이터 총 개수)이 됨을 유도하시오.

**[풀이]**
$\frac{\partial \Lambda}{\partial \pi_k} = \frac{N_k}{\pi_k} + \lambda = 0 \implies \pi_k = -\frac{N_k}{\lambda}$.
제약조건 $\sum_{k=1}^K \pi_k = 1$에 대입하면:
$$\sum_{k=1}^K \left(-\frac{N_k}{\lambda}\right) = -\frac{1}{\lambda} \sum_{k=1}^K N_k = 1 \implies \lambda = -\sum_{k=1}^K N_k$$
그런데 $\sum_{k=1}^K N_k = \sum_{k=1}^K \sum_{n=1}^N r_{nk} = \sum_{n=1}^N (\sum_{k=1}^K r_{nk}) = \sum_{n=1}^N 1 = N$ 이므로,
$$\lambda = -N$$

---

#### [문제 9: EM 알고리즘의 단조 증가성]
EM 알고리즘의 모든 반복 $t$에서 관측 데이터 로그 가능도 $\mathcal{L}(\theta) = \log p(\mathcal{X} \mid \theta)$가 단조 증가(monotonic increase), 즉 $\mathcal{L}(\theta^{(t+1)}) \ge \mathcal{L}(\theta^{(t)})$ 임을 보장하는 핵심 수학적 원리는 무엇인가?

**[풀이]**
젠센 부등식(Jensen's inequality)에 기반한 증거 하한(ELBO, Evidence Lower Bound) 이론에 기초한다. 로그 가능도 함수는 임의의 잠재변수 분포 $q(z)$에 대해 $\mathcal{L}(\theta) = \text{ELBO}(q, \theta) + \text{KL}(q(z) \parallel p(z \mid x, \theta))$ 로 분해된다.
- E-단계에서 $q(z) = p(z \mid x, \theta^{(t)})$로 설정하면 KL 발산이 0이 되어 하한선(ELBO)이 현재 로그 가능도 값과 정확히 접하게 된다.
- M-단계에서는 이 하한선을 $\theta$에 대해 최대화하여 $\theta^{(t+1)}$로 이동하므로, 새로운 로그 가능도는 최소한 이전 단계의 하한선 이상이 된다. 따라서 $\mathcal{L}(\theta^{(t+1)}) \ge \mathcal{L}(\theta^{(t)})$가 엄밀히 보장된다.

---

#### [문제 10: 커널 밀도 추정(KDE)과 GMM의 비교]
밀도 추정을 수행할 때 GMM(모수적 접근)과 KDE(비모수적 접근)의 장단점을 모델 복잡도, 데이터 저장 용량, 추론 계산 속도 측면에서 비교하시오.

**[풀이]**
1. **GMM (모수적)**:
   - 복잡도가 $K$개의 성분 모수$(\mu_k, \Sigma_k, \pi_k)$로 고정됨.
   - 학습 후 원본 데이터를 저장할 필요가 없어 메모리가 매우 절약됨.
   - 새로운 데이터 포인트 $x$의 밀도를 계산할 때 성분 개수 $K$번만 계산하면 되므로 추론이 매우 빠름.
   - 단점: 적절한 성분 수 $K$를 미리 지정해야 하며, 국소 최적해에 빠질 수 있음.
2. **KDE (비모수적)**:
   - 특정 분포 형태를 미리 가정하지 않아 매우 유연함.
   - 단점: 학습 후에도 전체 데이터셋 $N$개를 모두 보관해야 하므로 메모리 소모가 큼.
   - 새로운 점 $x$의 밀도를 계산할 때 $N$개의 모든 데이터와의 거리를 계산해야 하므로 추론 비용이 $O(N)$으로 매우 큼.

---

### 교재 연습문제 안내 (Exercises)

> **교재 원문 안내**: MML 교재 원본의 Part 2(8~12장)는 실전 머신러닝 응용을 다루는 장으로, Part 1(2~7장)과 달리 장 끝 연습문제(Exercises) 섹션이 별도로 수록되어 있지 않습니다. 따라서 본 해설서에서는 교재 본문에서 명시적으로 언급된 연습 과제 및 필기시험 출제 1순위 핵심 증명 과제들을 추출하여 해설과 풀이 방향을 안내합니다.

#### [본문 핵심 과제 1: 단일 가우시안의 MLE 유도 (11.2절 첫머리 Remark)]
- **질문 요약**: GMM에서 $K=1$일 때, 로그 가능도 공식이 단일 가우시안의 MLE 문제로 단순화되어 닫힌 형태 해 $\mu_{\text{ML}} = \frac{1}{N}\sum x_n$, $\sigma_{\text{ML}}^2 = \frac{1}{N}\sum (x_n-\mu)^2$가 도출됨을 보이시오.
- **풀이 방향**: $K=1$이면 $\pi_1 = 1$이 되어 합 기호가 사라집니다. 로그를 취하면 식 (11.11)처럼 지수함수가 벗겨져 $\mu$에 대한 2차 함수가 됩니다. $\mu$로 편미분하면 $-\sum_n \Sigma^{-1}(x_n - \mu) = 0 \implies \sum x_n = N\mu \implies \mu = \frac{1}{N}\sum x_n$이 즉시 증명됩니다.

#### [본문 핵심 과제 2: 완전 결합분포로부터 사후확률 유도 (교재 366쪽 식 11.69)]
- **질문 요약**: 잠재변수 모델에서 베이즈 정리를 적용하여 $p(z_k=1 \mid x)$가 책임도 $r_k$와 정확히 일치함을 보이시오.
- **풀이 방향**: $p(z_k=1 \mid x) = \frac{p(x, z_k=1)}{p(x)}$에서 분자는 $p(x \mid z_k=1)p(z_k=1) = \pi_k \mathcal{N}(x \mid \mu_k, \Sigma_k)$이고, 분모는 $p(x) = \sum_{j=1}^K p(x, z_j=1) = \sum_{j=1}^K \pi_j \mathcal{N}(x \mid \mu_j, \Sigma_j)$이므로 대입하면 정의와 정확히 일치합니다.

#### [본문 핵심 과제 3: 조상 표집(Ancestral Sampling) 알고리즘의 타당성 (교재 368쪽)]
- **질문 요약**: GMM의 조상 표집 절차를 통해 뽑힌 표본의 한계분포가 왜 GMM의 확률밀도 $p(x)$를 따르는지 확률론적으로 정당화하시오.
- **풀이 방향**: 표집된 표본의 확률은 $p(x) = \sum_z p(x, z) = \sum_z p(x \mid z)p(z)$입니다. 1단계에서 $z \sim p(z)$를 뽑고 2단계에서 $x \sim p(x \mid z)$를 뽑아 $z$를 버리는 행위는 수학적으로 잠재변수 $z$에 대해 주변화(marginalization)를 수행하는 것과 정확히 동치입니다.

---

## 시험 직전 10분 요약

| 개념 / 수식 | 핵심 내용 및 판별 기준 | 주의할 점 |
|---|---|---|
| **GMM 밀도 함수** | $p(x \mid \theta) = \sum_{k=1}^K \pi_k \mathcal{N}(x \mid \mu_k, \Sigma_k)$ | $\sum \pi_k = 1, 0 \le \pi_k \le 1$ |
| **로그 가능도** | $\mathcal{L}(\theta) = \sum_{n=1}^N \log \left( \sum_{k=1}^K \pi_k \mathcal{N}_k(x_n) \right)$ | 로그 안에 합이 있어 닫힌 해 불가능 |
| **책임도 ($r_{nk}$)** | $r_{nk} = \frac{\pi_k \mathcal{N}(x_n \mid \mu_k, \Sigma_k)}{\sum_{j=1}^K \pi_j \mathcal{N}(x_n \mid \mu_j, \Sigma_j)}$ | $\sum_{k=1}^K r_{nk} = 1$, 사후확률 $p(z_{nk}=1 \mid x_n)$ |
| **유효 데이터 수 ($N_k$)** | $N_k = \sum_{n=1}^N r_{nk}$ | $\sum_{k=1}^K N_k = N$ |
| **평균 갱신 공식** | $\mu_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} x_n$ | 책임도 기반 가중 표본 평균 |
| **공분산 갱신 공식** | $\Sigma_k^{\text{new}} = \frac{1}{N_k} \sum_{n=1}^N r_{nk} (x_n - \mu_k^{\text{new}})(x_n - \mu_k^{\text{new}})^\top$ | 갱신된 평균 $\mu_k^{\text{new}}$ 사용, 분모는 $N_k$ |
| **혼합 가중치 갱신** | $\pi_k^{\text{new}} = \frac{N_k}{N}$ | 라그랑주 승수 $\lambda = -N$에서 도출 |
| **EM 알고리즘 절차** | **E**: $r_{nk}$ 계산 $\implies$ **M**: $\mu_k, \Sigma_k, \pi_k$ 재추정 | 매 단계 로그 가능도 단조 증가 보장 |
| **K-Means와의 관계** | $\Sigma_k = \sigma^2 I, \sigma^2 \to 0$ 극한 | 소프트 할당 $\to$ 하드 할당으로 수렴 |
| **특이성 (Singularity)** | $\mu_k = x_n$ 이고 $\sigma_k^2 \to 0$ 일 때 가능도 $\to \infty$ | MLE의 대표적 과적합 병목 현상 |
