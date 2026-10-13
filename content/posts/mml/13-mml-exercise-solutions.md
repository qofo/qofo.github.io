---
title: "MML 교재 연습문제 전체 풀이: 2~7장 75문제"
slug: "mml-exercise-solutions"
date: 2026-10-13
weight: 13
series: ["MML 장별 상세 해설"]
categories: ["공부", "머신러닝 수학"]
tags: ["MML", "머신러닝 수학", "연습문제", "선형대수", "확률", "최적화"]
description: "MML 2~7장의 장 끝 연습문제 75개를 문제마다 단계별 풀이, 답, 검산 순서로 풀었다. 선형대수, 해석기하, 행렬분해, 벡터 미적분, 확률과 분포, 연속 최적화."
# h2 and h3 only (markup.tableOfContents); the theme's own TOC would list every h4 too
UseHugoToc: true
---
> **교재:** Deisenroth·Faisal·Ong, *Mathematics for Machine Learning* ([mml-book.github.io](https://mml-book.github.io/)에 공개된 PDF, 2024-01-15 판). 문제는 PDF 원문과 대조해 옮겼고, 쪽수와 식 번호도 그 PDF 기준이다.  
> **검산:** 숫자 답은 sympy로, 미분 답은 sympy와 수치 미분으로 검산했다. 6~7장의 수치 답은 scipy로 다시 계산했고, 자세한 내용은 각 장 머리에 적었다.  
> **범위:** 장 끝 연습문제는 Part I(2~7장)에만 있다. Part II(8~12장)에는 없다. 개념 해설은 연재의 장별 글([2장](02-mml-ch02-linear-algebra.md), [3장](03-mml-ch03-analytic-geometry.md), [4장](04-mml-ch04-matrix-decompositions.md), [5장](05-mml-ch05-vector-calculus.md), [6장](06-mml-ch06-probability.md), [7장](07-mml-ch07-continuous-optimization.md))에 있고, 이 글은 그 글들의 연습문제 답을 손으로 따라 쓸 수 있게 풀어 쓴 것이다.  
> **표기:** 교재와 같이 스칼라 함수를 벡터로 미분한 기울기는 **행벡터**($1\times D$)로 쓴다. $\log$는 자연로그다.

| 장 | 문제 | 교재 쪽 | 먼저 손으로 풀어 볼 문제 |
|---|---|---|---|
| [2 선형대수](#2장-선형대수) | 2.1~2.20 | 64~69 | 2.5(b), 2.8(b), 2.12, 2.17, 2.19(b), 2.20 |
| [3 해석기하](#3장-해석기하) | 3.1~3.10 | 96~97 | 3.3(b), 3.5, 3.6, 3.8 |
| [4 행렬분해](#4장-행렬분해) | 4.1~4.12 | 137~138 | 4.3, 4.6(a), 4.7(d), 4.8, 4.12 |
| [5 벡터 미적분](#5장-벡터-미적분) | 5.1~5.9 | 170~171 | 5.6, 5.7(b), 5.8(a), 5.9 |
| [6 확률과 분포](#6장-확률과-분포) | 6.1~6.13 | 222~224 | 6.4, 6.10, 6.12 |
| [7 연속 최적화](#7장-연속-최적화) | 7.1~7.11 | 247~248 | 7.6, 7.8, 7.10, 7.11 |

---

## 2장 선형대수

### 2.1 $(\mathbb R\setminus\{-1\},\star)$가 아벨군인가

**문제:** $a\star b:=ab+a+b$ ($a,b\in\mathbb R\setminus\{-1\}$). (a) 아벨군임을 보여라. (b) $3\star x\star x=15$를 풀어라.

**핵심 요령:** 양변에 1을 더하면 곱으로 갈라진다.
$$\begin{aligned} a\star b+1 &=ab+a+b+1 \\ &=(a+1)(b+1). \end{aligned}$$
즉 "1을 더한 값"끼리는 보통 곱셈을 한다. $\phi(a)=a+1$로 옮기면 $(\mathbb R\setminus\{-1\},\star)$는 $(\mathbb R\setminus\{0\},\cdot)$과 같은 구조다.

**풀이 (a):** 군의 네 조건(정의 2.7)과 교환법칙을 차례로 확인한다.
1. **닫힘:** $a,b\ne-1$이면 $a+1\ne0$, $b+1\ne0$이므로 $(a+1)(b+1)\ne0$. 따라서 $a\star b=(a+1)(b+1)-1\ne-1$. 결과가 다시 집합 안에 있다.
2. **결합법칙:** $(a\star b)\star c+1=\big((a\star b)+1\big)(c+1)=(a+1)(b+1)(c+1)$. 같은 계산으로 $a\star(b\star c)+1=(a+1)(b+1)(c+1)$. 두 값이 같으므로 $(a\star b)\star c=a\star(b\star c)$.
3. **항등원:** $a\star0=a\cdot0+a+0=a$, $0\star a=a$. 항등원은 $e=0$이고 $0\ne-1$이다.
4. **역원:** $a\star b=0$ ⇔ $(a+1)(b+1)=1$ ⇔ $b=\dfrac1{a+1}-1=-\dfrac{a}{a+1}$. 이 값은 $b+1=\frac1{a+1}\ne0$이라 $-1$이 아니므로 집합 안에 있다.
5. **교환법칙:** $ab+a+b=ba+b+a$이므로 $a\star b=b\star a$.

**풀이 (b):** 결합법칙이 있으니 괄호 없이 써도 된다. 양변에 1을 더한다.
$$\begin{aligned} &3\star x\star x+1 =(3+1)(x+1)(x+1) \\ &\quad =4(x+1)^2 =16\  \\ &\quad \Rightarrow\ (x+1)^2=4\  \Rightarrow\ x+1=\pm2. \end{aligned}$$

**답:** (a) 아벨군(항등원 $0$, $a$의 역원 $-\frac{a}{a+1}$). (b) **$x=1$ 또는 $x=-3$** (둘 다 $-1$이 아니라 허용된다).

**확인:** $x=1$: $3\star1=3+3+1=7$, $7\star1=7+7+1=15$. $x=-3$: $3\star(-3)=-9+3-3=-9$, $(-9)\star(-3)=27-9-3=15$.

---

### 2.2 $\mathbb Z_n$의 덧셈군과 곱셈군

**문제:** $\mathbb Z_n=\{\bar0,\dots,\overline{n-1}\}$에서 $\bar a\oplus\bar b=\overline{a+b}$, $\bar a\otimes\bar b=\overline{a\times b}$. (a) $(\mathbb Z_n,\oplus)$가 군인지, 아벨군인지. (b) $\mathbb Z_5\setminus\{\bar0\}$의 곱셈표를 그리고 아벨군임을 보여라. (c) $(\mathbb Z_8\setminus\{\bar0\},\otimes)$가 군이 아님을 보여라. (d) $(\mathbb Z_n\setminus\{\bar0\},\otimes)$가 군 ⇔ $n$이 소수임을 보여라.

**풀이 (a):**
- **잘 정의됨(먼저 확인할 점):** $a\equiv a'$, $b\equiv b'\pmod n$이면 $a=a'+kn$, $b=b'+ln$이라 $a+b=(a'+b')+(k+l)n$, 즉 $\overline{a+b}=\overline{a'+b'}$. 대표를 어느 것으로 골라도 결과가 같다.
- 닫힘: $\overline{a+b}$도 합동류이므로 $\mathbb Z_n$의 원소.
- 결합법칙: $(\bar a\oplus\bar b)\oplus\bar c=\overline{(a+b)+c}=\overline{a+(b+c)}=\bar a\oplus(\bar b\oplus\bar c)$ (정수 덧셈의 결합법칙).
- 항등원: $\bar0$ ($\bar a\oplus\bar0=\bar a$).
- 역원: $\bar a$의 역원은 $\overline{-a}=\overline{n-a}$ ($\overline{a+(n-a)}=\bar n=\bar0$).
- 교환: $\overline{a+b}=\overline{b+a}$.

**답 (a):** 아벨군이다.

**풀이 (b):** $\mathbb Z_5\setminus\{\bar0\}=\{\bar1,\bar2,\bar3,\bar4\}$의 곱셈표 (곱한 뒤 5로 나눈 나머지):

| $\otimes$ | $\bar1$ | $\bar2$ | $\bar3$ | $\bar4$ |
|---|---|---|---|---|
| $\bar1$ | $\bar1$ | $\bar2$ | $\bar3$ | $\bar4$ |
| $\bar2$ | $\bar2$ | $\bar4$ | $\bar1$ | $\bar3$ |
| $\bar3$ | $\bar3$ | $\bar1$ | $\bar4$ | $\bar2$ |
| $\bar4$ | $\bar4$ | $\bar3$ | $\bar2$ | $\bar1$ |

(예: $\bar2\otimes\bar3=\bar6=\bar1$, $\bar3\otimes\bar3=\bar9=\bar4$, $\bar4\otimes\bar4=\overline{16}=\bar1$.)
- 닫힘: 표 안에 $\bar0$이 없다.
- 항등원: $\bar1$ (첫 행·첫 열이 그대로).
- 역원: 각 행에서 $\bar1$이 나오는 열을 찾는다. $\bar1^{-1}=\bar1$, $\bar2^{-1}=\bar3$, $\bar3^{-1}=\bar2$, $\bar4^{-1}=\bar4$.
- 결합·교환법칙: 정수 곱셈에서 물려받는다(표가 대각선에 대해 대칭인 것이 교환법칙의 모습).

**답 (b):** $(\mathbb Z_5\setminus\{\bar0\},\otimes)$는 아벨군.

**풀이 (c):** $\bar2\otimes\bar4=\bar8=\bar0\notin\mathbb Z_8\setminus\{\bar0\}$. 닫혀 있지 않으므로 군이 아니다. (또 다른 이유: $2k$는 언제나 짝수라 8로 나눈 나머지가 1이 될 수 없어 $\bar2$는 역원이 없다.)

**풀이 (d):**
- **(⇐) $n$이 소수일 때:** $1\le a,b\le n-1$로 두자.
  - 닫힘: $\bar a\otimes\bar b=\bar0$이면 $n\mid ab$. 소수가 곱을 나누면 인수 중 하나를 나누는데, $0<a,b<n$이라 불가능. 따라서 결과가 $\bar0$이 아니다.
  - 역원: $n$이 소수이고 $0<a<n$이면 $\gcd(a,n)=1$. 베주 정리로 $au+nv=1$인 정수 $u,v$가 있고, 양변을 $n$으로 나눈 나머지를 보면 $\bar a\otimes\bar u=\bar1$. 즉 $\bar u$가 역원($\bar u\ne\bar0$, 아니면 $\bar1=\bar0$이 된다).
  - 항등원 $\bar1$, 결합법칙은 정수 곱셈에서 물려받는다.
- **(⇒) 대우로 증명, $n$이 소수가 아니면 군이 아님:**
  - $n=1$: $\mathbb Z_1\setminus\{\bar0\}=\varnothing$이라 항등원이 없어 군이 아니다.
  - $n$이 합성수: $n=ab$ ($1<a,b<n$)로 쓸 수 있다. 그러면 $\bar a,\bar b\ne\bar0$인데 $\bar a\otimes\bar b=\bar n=\bar0$. 닫힘이 깨진다.

**답 (d):** $(\mathbb Z_n\setminus\{\bar0\},\otimes)$가 군 ⇔ $n$이 소수.

---

### 2.3 위삼각 행렬 집합 $\mathcal G$

**문제:** $\mathcal G=\left\{\begin{bmatrix}1&x&z\\0&1&y\\0&0&1\end{bmatrix}:x,y,z\in\mathbb R\right\}$이 행렬곱에 대해 군인가? 아벨군인가?

**풀이:** 원소를 $M(x,y,z)$로 쓴다. 두 원소를 곱하면
$$\begin{aligned} &M(x,y,z)\,M(x',y',z') \\ &\quad =\begin{bmatrix}1&x+x'&z'+xy'+z\\0&1&y+y'\\0&0&1\end{bmatrix} \\ &\quad =M(x+x',\ y+y',\ z+z'+xy'). \end{aligned}$$
(1행 3열: $1\cdot z'+x\cdot y'+z\cdot1$.)
1. **닫힘:** 결과가 같은 꼴이다.
2. **결합법칙:** 행렬곱은 결합법칙을 만족한다.
3. **항등원:** $M(0,0,0)=I_3\in\mathcal G$.
4. **역원:** $M(-x,-y,xy-z)$를 곱해 보면 위 공식으로 $M(0,0,\ (xy-z)+x(-y)+z)=M(0,0,0)$. 이 역원도 $\mathcal G$ 안에 있다.

**교환법칙이 깨지는 예:** $M(1,0,0)M(0,1,0)=M(1,1,0+1\cdot1)=M(1,1,1)$인데 $M(0,1,0)M(1,0,0)=M(1,1,0+0\cdot0)=M(1,1,0)$. 오른쪽 위 원소가 다르다(일반적으로 $xy'\ne x'y$이면 다르다).

**답:** **군이지만 아벨군은 아니다.** (하이젠베르크 군이라는 이름이 있다.)

---

### 2.4 행렬곱 계산

**문제:** 가능하면 곱을 구하라.

**풀이:** 먼저 크기를 본다. $(m\times n)(n\times k)$만 정의되고 결과는 $m\times k$.

(a) $\begin{bmatrix}1&2\\4&5\\7&8\end{bmatrix}\begin{bmatrix}1&1&0\\0&1&1\\1&0&1\end{bmatrix}$: $(3\times2)(3\times3)$, 안쪽 크기 $2\ne3$ → **정의되지 않는다.**

(b) $\begin{bmatrix}1&2&3\\4&5&6\\7&8&9\end{bmatrix}\begin{bmatrix}1&1&0\\0&1&1\\1&0&1\end{bmatrix}$: 오른쪽 행렬의 열이 $(1,0,1)$, $(1,1,0)$, $(0,1,1)$이므로 결과의 $(i,j)$ 원소는 "왼쪽 행렬 $i$행에서 두 성분을 더한 값"이다. 1행: $1+3=4$, $1+2=3$, $2+3=5$.
$$=\begin{bmatrix}4&3&5\\10&9&11\\16&15&17\end{bmatrix}$$

(c) 순서를 바꾼 곱. 이번에는 왼쪽 행렬의 행 $(1,1,0)$, $(0,1,1)$, $(1,0,1)$이 오른쪽 행렬의 **행을 두 개씩 더한다**. 1행 = 1행+2행 $=(5,7,9)$, 2행 = 2행+3행 $=(11,13,15)$, 3행 = 1행+3행 $=(8,10,12)$.
$$\begin{gathered} =\begin{bmatrix}5&7&9\\11&13&15\\8&10&12\end{bmatrix} \\ (\text{(b)와 다르다: }AB\ne BA) \end{gathered}$$

(d) $\begin{bmatrix}1&2&1&2\\4&1&-1&-4\end{bmatrix}\begin{bmatrix}0&3\\1&-1\\2&1\\5&2\end{bmatrix}$: $(2\times4)(4\times2)=2\times2$.
- $(1,1)$: $0+2+2+10=14$, $(1,2)$: $3-2+1+4=6$
- $(2,1)$: $0+1-2-20=-21$, $(2,2)$: $12-1-1-8=2$
$$=\begin{bmatrix}14&6\\-21&2\end{bmatrix}$$

(e) 순서를 바꾸면 $(4\times2)(2\times4)=4\times4$.
$$\begin{aligned} &\begin{bmatrix}0&3\\1&-1\\2&1\\5&2\end{bmatrix}\begin{bmatrix}1&2&1&2\\4&1&-1&-4\end{bmatrix} \\ &\quad =\begin{bmatrix}12&3&-3&-12\\-3&1&2&6\\6&5&1&0\\13&12&3&2\end{bmatrix} \end{aligned}$$
(예: 1행은 $0\cdot(1,2,1,2)+3\cdot(4,1,-1,-4)$, 4행은 $5\cdot(1,2,1,2)+2\cdot(4,1,-1,-4)=(13,12,3,2)$.)

---

### 2.5 $Ax=b$의 해집합

**(a)** $A=\begin{bmatrix}1&1&-1&-1\\2&5&-7&-5\\2&-1&1&3\\5&2&-4&2\end{bmatrix}$, $b=\begin{bmatrix}1\\-2\\4\\6\end{bmatrix}$.

**풀이:** 첨가행렬 $[A\mid b]$를 소거한다.
$$\begin{aligned} &\left[\begin{array}{cccc|c}1&1&-1&-1&1\\2&5&-7&-5&-2\\2&-1&1&3&4\\5&2&-4&2&6\end{array}\right] \\ &\xrightarrow[R_4-5R_1]{R_2-2R_1,\ R_3-2R_1} \\ &\left[\begin{array}{cccc|c}1&1&-1&-1&1\\0&3&-5&-3&-4\\0&-3&3&5&2\\0&-3&1&7&1\end{array}\right] \end{aligned}$$
$$\begin{aligned} &\xrightarrow[R_4+R_2]{R_3+R_2}
\left[\begin{array}{cccc|c}1&1&-1&-1&1\\0&3&-5&-3&-4\\0&0&-2&2&-2\\0&0&-4&4&-3\end{array}\right] \\ &\xrightarrow{R_4-2R_3}
\left[\begin{array}{cccc|c}1&1&-1&-1&1\\0&3&-5&-3&-4\\0&0&-2&2&-2\\0&0&0&0&1\end{array}\right] \end{aligned}$$
마지막 행은 $0=1$이라는 모순이다. ($\text{rk}(A)=3<\text{rk}([A\mid b])=4$.)

**답:** **해가 없다. $\mathcal S=\varnothing$.**

**(b)** $A=\begin{bmatrix}1&-1&0&0&1\\1&1&0&-3&0\\2&-1&0&1&-1\\-1&2&0&-2&-1\end{bmatrix}$, $b=\begin{bmatrix}3\\6\\5\\-1\end{bmatrix}$.

**풀이:**
$$\begin{aligned} &\xrightarrow[R_4+R_1]{R_2-R_1,\ R_3-2R_1} \\ &\left[\begin{array}{ccccc|c}1&-1&0&0&1&3\\0&2&0&-3&-1&3\\0&1&0&1&-3&-1\\0&1&0&-2&0&2\end{array}\right] \\ &\xrightarrow{R_2\leftrightarrow R_3} \\ &\left[\begin{array}{ccccc|c}1&-1&0&0&1&3\\0&1&0&1&-3&-1\\0&2&0&-3&-1&3\\0&1&0&-2&0&2\end{array}\right] \end{aligned}$$
$$\begin{aligned} &\xrightarrow[R_4-R_2]{R_3-2R_2} \\ &\left[\begin{array}{ccccc|c}1&-1&0&0&1&3\\0&1&0&1&-3&-1\\0&0&0&-5&5&5\\0&0&0&-3&3&3\end{array}\right] \\ &\xrightarrow[R_4+3R_3]{R_3\div(-5)} \\ &\left[\begin{array}{ccccc|c}1&-1&0&0&1&3\\0&1&0&1&-3&-1\\0&0&0&1&-1&-1\\0&0&0&0&0&0\end{array}\right] \end{aligned}$$
피벗은 $x_1,x_2,x_4$. 자유변수는 $x_3$(어떤 식에도 나오지 않는다)과 $x_5$. 뒤에서부터 대입한다.
- $x_4=-1+x_5$
- $x_2=-1-x_4+3x_5=-1-(-1+x_5)+3x_5=2x_5$
- $x_1=3+x_2-x_5=3+x_5$

**답:**
$$\mathcal S=\left\{\begin{bmatrix}3\\0\\0\\-1\\0\end{bmatrix}+\lambda_1\begin{bmatrix}0\\0\\1\\0\\0\end{bmatrix}+\lambda_2\begin{bmatrix}1\\2\\0\\1\\1\end{bmatrix}\ :\ \lambda_1,\lambda_2\in\mathbb R\right\}$$

**확인:** 특수해 $(3,0,0,-1,0)$: 1행 $3=3$, 2행 $3+3=6$, 3행 $6-1=5$, 4행 $-3+2=-1$. 영공간 벡터 $(1,2,0,1,1)$: 1행 $1-2+1=0$, 2행 $1+2-3=0$, 3행 $2-2+1-1=0$, 4행 $-1+4-2-1=0$.

---

### 2.6 가우스 소거로 모든 해

**문제:** $A=\begin{bmatrix}0&1&0&0&1&0\\0&0&0&1&1&0\\0&1&0&0&0&1\end{bmatrix}$, $b=\begin{bmatrix}2\\-1\\1\end{bmatrix}$.

**풀이:**
$$\begin{aligned} &\left[\begin{array}{cccccc|c}0&1&0&0&1&0&2\\0&0&0&1&1&0&-1\\0&1&0&0&0&1&1\end{array}\right] \xrightarrow{R_3-R_1} \\ &\left[\begin{array}{cccccc|c}0&1&0&0&1&0&2\\0&0&0&1&1&0&-1\\0&0&0&0&-1&1&-1\end{array}\right] \end{aligned}$$
$$\begin{aligned} &\xrightarrow{R_3\cdot(-1)} \\ &\left[\begin{array}{cccccc|c}0&1&0&0&1&0&2\\0&0&0&1&1&0&-1\\0&0&0&0&1&-1&1\end{array}\right] \\ &\xrightarrow[R_2-R_3]{R_1-R_3} \\ &\left[\begin{array}{cccccc|c}0&1&0&0&0&1&1\\0&0&0&1&0&1&-2\\0&0&0&0&1&-1&1\end{array}\right] \end{aligned}$$
피벗 열은 $x_2,x_4,x_5$. 자유변수는 $x_1,x_3,x_6$ ($x_1,x_3$은 어떤 식에도 없다).
- 특수해: 자유변수를 모두 0으로 두면 $x_2=1$, $x_4=-2$, $x_5=1$.
- 영공간: $x_1=1$ → $e_1$; $x_3=1$ → $e_3$; $x_6=1$ → $x_2=-1$, $x_4=-1$, $x_5=1$ (Minus-1 트릭과 같은 결과).

**답:**
$$\begin{aligned} x &=\begin{bmatrix}0\\1\\0\\-2\\1\\0\end{bmatrix} +\lambda_1\begin{bmatrix}1\\0\\0\\0\\0\\0\end{bmatrix} +\lambda_2\begin{bmatrix}0\\0\\1\\0\\0\\0\end{bmatrix} \\ &\quad +\lambda_3\begin{bmatrix}0\\-1\\0\\-1\\1\\1\end{bmatrix},\quad\lambda_i\in\mathbb R \end{aligned}$$

---

### 2.7 $Ax=12x$, $\sum x_i=1$

**문제:** $A=\begin{bmatrix}6&4&3\\6&0&9\\0&8&0\end{bmatrix}$일 때 $Ax=12x$이고 $x_1+x_2+x_3=1$인 $x$를 모두 구하라.

**풀이:** $Ax=12x$ ⇔ $(A-12I)x=0$. 동차 연립방정식으로 바꾼다.
$$\begin{aligned} A-12I &=\begin{bmatrix}-6&4&3\\6&-12&9\\0&8&-12\end{bmatrix} \\ &\xrightarrow{R_2+R_1}\begin{bmatrix}-6&4&3\\0&-8&12\\0&8&-12\end{bmatrix} \\ &\xrightarrow{R_3+R_2}\begin{bmatrix}-6&4&3\\0&-8&12\\0&0&0\end{bmatrix} \end{aligned}$$
- 2행: $-8x_2+12x_3=0$ → $x_2=\tfrac32x_3$
- 1행: $-6x_1+4\cdot\tfrac32x_3+3x_3=0$ → $6x_1=9x_3$ → $x_1=\tfrac32x_3$

해는 $x=t\,(3,3,2)^\top$. 합 조건 $3t+3t+2t=8t=1$ → $t=\tfrac18$.

**답:** **$x=\left(\tfrac38,\ \tfrac38,\ \tfrac14\right)^\top$** (유일).

**확인:** $A(3,3,2)^\top=(18+12+6,\ 18+18,\ 24)=(36,36,24)=12\,(3,3,2)$. 4장 말로 하면 "고유값 12의 고유벡터를 성분 합이 1이 되게 맞춘 것"이다.

---

### 2.8 역행렬

**(a)** $A=\begin{bmatrix}2&3&4\\3&4&5\\4&5&6\end{bmatrix}$.

**풀이:** 1행 + 3행 $=(6,8,10)=2\times$2행. 행들이 일차종속이라 랭크가 3보다 작다. 행렬식으로도 $2(24-25)-3(18-20)+4(15-16)=-2+6-4=0$.

**답:** **역행렬이 없다.**

**(b)** $A=\begin{bmatrix}1&0&1&0\\0&1&1&0\\1&1&0&1\\1&1&1&0\end{bmatrix}$.

**풀이:** $[A\mid I]$를 $[I\mid A^{-1}]$로 만든다.
$$\begin{aligned} &\left[\begin{array}{cccc|cccc}1&0&1&0&1&0&0&0\\0&1&1&0&0&1&0&0\\1&1&0&1&0&0&1&0\\1&1&1&0&0&0&0&1\end{array}\right] \\ &\xrightarrow[R_4-R_1]{R_3-R_1} \\ &\left[\begin{array}{cccc|cccc}1&0&1&0&1&0&0&0\\0&1&1&0&0&1&0&0\\0&1&-1&1&-1&0&1&0\\0&1&0&0&-1&0&0&1\end{array}\right] \end{aligned}$$
$$\begin{aligned} &\xrightarrow[R_4-R_2]{R_3-R_2} \\ &\left[\begin{array}{cccc|cccc}1&0&1&0&1&0&0&0\\0&1&1&0&0&1&0&0\\0&0&-2&1&-1&-1&1&0\\0&0&-1&0&-1&-1&0&1\end{array}\right] \\ &\xrightarrow{R_3\leftrightarrow R_4} \\ &\left[\begin{array}{cccc|cccc}1&0&1&0&1&0&0&0\\0&1&1&0&0&1&0&0\\0&0&-1&0&-1&-1&0&1\\0&0&-2&1&-1&-1&1&0\end{array}\right] \end{aligned}$$
$$\begin{aligned} &\xrightarrow[R_3\cdot(-1)]{R_4-2R_3} \\ &\left[\begin{array}{cccc|cccc}1&0&1&0&1&0&0&0\\0&1&1&0&0&1&0&0\\0&0&1&0&1&1&0&-1\\0&0&0&1&1&1&1&-2\end{array}\right] \\ &\xrightarrow[R_2-R_3]{R_1-R_3} \\ &\left[\begin{array}{cccc|cccc}1&0&0&0&0&-1&0&1\\0&1&0&0&-1&0&0&1\\0&0&1&0&1&1&0&-1\\0&0&0&1&1&1&1&-2\end{array}\right] \end{aligned}$$
(4행 계산: $R_4-2R_3$의 오른쪽은 $(-1,-1,1,0)-2(-1,-1,0,1)=(1,1,1,-2)$.)

**답:**
$$A^{-1}=\begin{bmatrix}0&-1&0&1\\-1&0&0&1\\1&1&0&-1\\1&1&1&-2\end{bmatrix}$$

**확인:** $A$의 1행 $(1,0,1,0)$과 $A^{-1}$의 각 열을 곱하면 $(0+1,\ -1+1,\ 0+0,\ 1-1)=(1,0,0,0)$. sympy로 $AA^{-1}=I$ 확인.

---

### 2.9 부분공간 판정

**판정 기준:** $\mathbb R^3$의 부분집합 $U$가 부분공간 ⇔ $0\in U$이고, 덧셈과 스칼라곱에 닫혀 있다.

**(a)** $A=\{(\lambda,\lambda+\mu^3,\lambda-\mu^3)\}$. $\nu=\mu^3$로 바꾸면 $\mu\mapsto\mu^3$이 실수 전체를 덮으므로 $\nu$도 모든 실수를 돈다. 그래서 $A=\{\lambda(1,1,1)+\nu(0,1,-1)\}=\text{span}[(1,1,1),(0,1,-1)]$. **부분공간이다.**

**(b)** $B=\{(\lambda^2,-\lambda^2,0)\}$. $(1,-1,0)\in B$인데 $-1$배 한 $(-1,1,0)$은 첫 성분이 음수라 $B$에 없다(첫 성분 $\lambda^2\ge0$). 스칼라곱에 닫혀 있지 않다. **부분공간이 아니다.** (반직선이다.)

**(c)** $C=\{\xi_1-2\xi_2+3\xi_3=\gamma\}$. $\gamma\ne0$이면 $0$이 식을 만족하지 않아 $0\notin C$ → 아니다. $\gamma=0$이면 동차 연립방정식 $[1,-2,3]\,\xi=0$의 해집합(핵)이라 부분공간이다. **$\gamma=0$일 때만 부분공간.**

**(d)** $D=\{\xi_2\in\mathbb Z\}$. $(0,1,0)\in D$인데 $\tfrac12$배 한 $(0,\tfrac12,0)$은 $D$에 없다. **부분공간이 아니다.**

---

### 2.10 일차독립 판정

**(a)** $x_1=(2,-1,3)$, $x_2=(1,1,-2)$, $x_3=(3,-3,8)$.

**풀이:** 열로 세운 행렬을 소거한다(계산이 편하도록 2행을 맨 위로).
$$\begin{aligned} &\begin{bmatrix}2&1&3\\-1&1&-3\\3&-2&8\end{bmatrix} \to\begin{bmatrix}-1&1&-3\\2&1&3\\3&-2&8\end{bmatrix} \\ &\xrightarrow[R_3+3R_1]{R_2+2R_1}\begin{bmatrix}-1&1&-3\\0&3&-3\\0&1&-1\end{bmatrix} \\ &\xrightarrow{R_3-\frac13R_2}\begin{bmatrix}-1&1&-3\\0&3&-3\\0&0&0\end{bmatrix} \end{aligned}$$
피벗이 2개라 랭크 2 < 3. 3열이 피벗이 아니므로 $x_3$은 앞의 두 벡터로 표현된다: $\lambda_3=1$로 두면 $3\lambda_2=3$ → $\lambda_2=1$, $-\lambda_1+1-3=0$ → $\lambda_1=-2$. 즉 $-2x_1+x_2+x_3=0$.

**답:** **일차종속.** $x_3=2x_1-x_2$ (확인: $2(2,-1,3)-(1,1,-2)=(3,-3,8)$).

**(b)** $x_1=(1,2,1,0,0)$, $x_2=(1,1,0,1,1)$, $x_3=(1,0,0,1,1)$.

**풀이:** $\lambda_1x_1+\lambda_2x_2+\lambda_3x_3=0$을 성분별로 쓴다.
- 3번째 성분: $\lambda_1=0$
- 2번째 성분: $2\lambda_1+\lambda_2=0$ → $\lambda_2=0$
- 1번째 성분: $\lambda_1+\lambda_2+\lambda_3=0$ → $\lambda_3=0$

**답:** 자명한 해만 있으므로 **일차독립**.

---

### 2.11 일차결합으로 쓰기

**문제:** $y=(1,-2,5)$를 $x_1=(1,1,1)$, $x_2=(1,2,3)$, $x_3=(2,-1,1)$의 일차결합으로.

**풀이:** $\lambda_1x_1+\lambda_2x_2+\lambda_3x_3=y$.
$$\begin{aligned} &\left[\begin{array}{ccc|c}1&1&2&1\\1&2&-1&-2\\1&3&1&5\end{array}\right] \\ &\xrightarrow[R_3-R_1]{R_2-R_1}\left[\begin{array}{ccc|c}1&1&2&1\\0&1&-3&-3\\0&2&-1&4\end{array}\right] \\ &\xrightarrow{R_3-2R_2}\left[\begin{array}{ccc|c}1&1&2&1\\0&1&-3&-3\\0&0&5&10\end{array}\right] \end{aligned}$$
$\lambda_3=2$, $\lambda_2=-3+3\cdot2=3$, $\lambda_1=1-3-4=-6$.

**답:** **$y=-6x_1+3x_2+2x_3$.**

**확인:** $-6(1,1,1)+3(1,2,3)+2(2,-1,1)=(-6+3+4,\ -6+6-2,\ -6+9+2)=(1,-2,5)$.

---

### 2.12 두 생성 공간의 교집합

**문제:** $U_1=\text{span}[u_1,u_2,u_3]$, $U_2=\text{span}[v_1,v_2,v_3]$의 교집합의 기저.
$u_1=(1,1,-3,1)$, $u_2=(2,-1,0,-1)$, $u_3=(-1,1,-1,1)$; $v_1=(-1,-2,2,1)$, $v_2=(2,-2,0,0)$, $v_3=(-3,6,-2,-1)$.

**풀이:**
**1단계: 각 공간의 기저부터 줄인다.**
- $U_1$: $u_1-2u_2=(-3,3,-3,3)=3u_3$이므로 $u_3=\tfrac13u_1-\tfrac23u_2$. $u_1,u_2$는 서로 배수가 아니라 독립. 기저 $\{u_1,u_2\}$, $\dim U_1=2$.
- $U_2$: $-v_1-2v_2=(1-4,\ 2+4,\ -2,\ -1)=(-3,6,-2,-1)=v_3$. 기저 $\{v_1,v_2\}$, $\dim U_2=2$.

**2단계: 공통 벡터 조건을 세운다.** $x\in U_1\cap U_2$ ⇔ $x=\lambda_1u_1+\lambda_2u_2=\mu_1v_1+\mu_2v_2$. 이항하면 $[u_1\ u_2\ {-v_1}\ {-v_2}]\,(\lambda_1,\lambda_2,\mu_1,\mu_2)^\top=0$.
$$\begin{aligned} &\begin{bmatrix}1&2&1&-2\\1&-1&2&2\\-3&0&-2&0\\1&-1&-1&0\end{bmatrix} \\ &\xrightarrow[R_4-R_1]{R_2-R_1,\ R_3+3R_1}
\begin{bmatrix}1&2&1&-2\\0&-3&1&4\\0&6&1&-6\\0&-3&-2&2\end{bmatrix} \\ &\xrightarrow[R_4-R_2]{R_3+2R_2}
\begin{bmatrix}1&2&1&-2\\0&-3&1&4\\0&0&3&2\\0&0&-3&-2\end{bmatrix} \\ &\xrightarrow{R_4+R_3}
\begin{bmatrix}1&2&1&-2\\0&-3&1&4\\0&0&3&2\\0&0&0&0\end{bmatrix} \end{aligned}$$
랭크 3이라 $\dim(U_1+U_2)=3$, 따라서 $\dim(U_1\cap U_2)=2+2-3=1$.

**3단계: 해를 구한다.** $\mu_2=t$로 두면
- $3\mu_1+2t=0$ → $\mu_1=-\tfrac23t$
- $-3\lambda_2+\mu_1+4t=0$ → $\lambda_2=\tfrac{10}9t$
- $\lambda_1=-2\lambda_2-\mu_1+2t=\tfrac{-20+6+18}{9}t=\tfrac49t$

$t=9$로 잡으면 $\lambda=(4,10)$, $\mu=(-6,9)$. 교집합 벡터는 $4u_1+10u_2=(24,-6,-12,-6)=6\,(4,-1,-2,-1)$.

**답:** **$U_1\cap U_2=\text{span}\big[(4,-1,-2,-1)^\top\big]$.**

**확인:** $U_2$ 쪽으로도 $-6v_1+9v_2=(6+18,\ 12-18,\ -12,\ -6)=(24,-6,-12,-6)$. 같은 벡터다.

---

### 2.13 두 해공간(핵)의 차원·기저·교집합

**문제:** $U_1=\{x:A_1x=0\}$, $U_2=\{x:A_2x=0\}$, $A_1=\begin{bmatrix}1&0&1\\1&-2&-1\\2&1&3\\1&0&1\end{bmatrix}$, $A_2=\begin{bmatrix}3&-3&0\\1&2&3\\7&-5&2\\3&-1&2\end{bmatrix}$.

**풀이:**
- $A_1$: $R_2-R_1=(0,-2,-2)$, $R_3-2R_1=(0,1,1)$, $R_4-R_1=0$. 남은 두 식은 $x_2+x_3=0$과 $x_1+x_3=0$(랭크 2). $x_3=t$로 두면 $x=t(-1,-1,1)$.
- $A_2$: 1행과 2행을 바꾸고 $(1,2,3)$으로 소거하면 $(3,-3,0)-3(1,2,3)=(0,-9,-9)$, $(7,-5,2)-7(1,2,3)=(0,-19,-19)$, $(3,-1,2)-3(1,2,3)=(0,-7,-7)$. 모두 $(0,1,1)$의 배수라 랭크 2. 남은 식은 $x_1+2x_2+3x_3=0$과 $x_2+x_3=0$. $x_2=-x_3$을 넣으면 $x_1=-2x_2-3x_3=2x_3-3x_3=-x_3$. 역시 $x=t(-1,-1,1)$.

**답:**
- (a) $\dim U_1=\dim U_2=3-2=1$
- (b) 두 공간 모두 기저 $\{(1,1,-1)^\top\}$
- (c) $U_1=U_2$이므로 $U_1\cap U_2=\text{span}[(1,1,-1)^\top]$

**확인:** $A_2(-1,-1,1)^\top=(-3+3,\ -1-2+3,\ -7+5+2,\ -3+1+2)=0$.

---

### 2.14 두 열공간의 차원·기저·교집합

**문제:** 2.13과 같은 행렬. 이번에는 $U_1,U_2$가 각 행렬의 **열이 생성하는 공간**.

**풀이:**
- 2.13에서 각 행렬의 랭크가 2였으므로 $\dim U_1=\dim U_2=2$. 열공간 차원 = 랭크.
- 기저: 소거에서 피벗이 1, 2열이었으므로 원래 행렬의 1, 2열을 고른다. 실제로 3열 = 1열 + 2열이다($A_1$: $(1,1,2,1)+(0,-2,1,0)=(1,-1,3,1)$; $A_2$: $(3,1,7,3)+(-3,2,-5,-1)=(0,3,2,2)$).
  - $U_1$: $a_1=(1,1,2,1)$, $a_2=(0,-2,1,0)$
  - $U_2$: $b_1=(3,1,7,3)$, $b_2=(-3,2,-5,-1)$
- 교집합: $\lambda_1a_1+\lambda_2a_2=\mu_1b_1+\mu_2b_2$를 푼다. $[a_1\ a_2\ b_1\ b_2]$의 랭크가 3이라 교집합은 1차원이다. 해 하나: $\lambda=(3,1)$, $\mu=(1,0)$, 즉 $3a_1+a_2=(3,\ 3-2,\ 6+1,\ 3)=(3,1,7,3)=b_1$.

**답:**
- (a) $\dim U_1=\dim U_2=2$
- (b) $U_1$: $\{(1,1,2,1)^\top,(0,-2,1,0)^\top\}$, $U_2$: $\{(3,1,7,3)^\top,(-3,2,-5,-1)^\top\}$
- (c) **$U_1\cap U_2=\text{span}[(3,1,7,3)^\top]$**

**비교:** 같은 행렬이라도 2.13(핵)은 $\mathbb R^3$ 안의 공간, 2.14(열공간)는 $\mathbb R^4$ 안의 공간이다. 랭크-퇴화차수 정리(정리 2.24)로 $\dim\ker+\dim\text{Im}=1+2=3$.

---

### 2.15 $F\cap G$

**문제:** $F=\{(x,y,z):x+y-z=0\}$, $G=\{(a-b,\ a+b,\ a-3b):a,b\in\mathbb R\}$.

**풀이 (a):** $F$는 동차 연립방정식 $[1,1,-1]\,v=0$의 해집합(핵)이라 부분공간. $G=\{a(1,1,1)+b(-1,1,-3)\}=\text{span}[(1,1,1),(-1,1,-3)]$이라 부분공간.

**풀이 (b) 기저를 쓰지 않고:** $G$의 원소를 $F$의 식에 넣는다.
$$\begin{aligned} &(a-b)+(a+b)-(a-3b) =a+3b \\ &\quad =0\  \Rightarrow\ a=-3b. \end{aligned}$$
대입하면 $(a-b,\ a+b,\ a-3b)=(-4b,\ -2b,\ -6b)=-2b\,(2,1,3)$.

**답 (b):** **$F\cap G=\text{span}[(2,1,3)^\top]$.** (확인: $2+1-3=0$이라 $F$에 들어간다.)

**풀이 (c) 기저로 다시:** $F$: $x=z-y$이므로 $(x,y,z)=y(-1,1,0)+z(1,0,1)$, 기저 $\{(-1,1,0),(1,0,1)\}$. $G$: 기저 $\{(1,1,1),(-1,1,-3)\}$(서로 배수가 아님).
$\alpha(-1,1,0)+\beta(1,0,1)=\gamma(1,1,1)+\delta(-1,1,-3)$을 성분별로 쓰면
- 2성분: $\alpha=\gamma+\delta$
- 3성분: $\beta=\gamma-3\delta$
- 1성분: $-\alpha+\beta=\gamma-\delta$ → $-(\gamma+\delta)+(\gamma-3\delta)=\gamma-\delta$ → $\gamma=-3\delta$

교집합 벡터는 $\gamma(1,1,1)+\delta(-1,1,-3)=\delta(-4,-2,-6)$. (b)와 같다.

---

### 2.16 선형사상 판정

**기준:** $\Phi(\alpha x+\beta y)=\alpha\Phi(x)+\beta\Phi(y)$가 모든 $x,y$, 모든 스칼라에서 성립하는가.

- **(a) 적분 $\Phi(f)=\int_a^bf(x)\,dx$:** 적분의 선형성 $\int(\alpha f+\beta g)=\alpha\int f+\beta\int g$. **선형.**
- **(b) 미분 $\Phi(f)=f'$:** $(\alpha f+\beta g)'=\alpha f'+\beta g'$. **선형.**
- **(c) $\Phi(x)=\cos x$:** $\Phi(0)=1\ne0$. 선형사상은 반드시 $0$을 $0$으로 보낸다. **선형 아님.** (또는 $\cos(2\pi)=1\ne2\cos\pi=-2$.)
- **(d) $\Phi(x)=\begin{bmatrix}1&2&3\\1&4&3\end{bmatrix}x$:** 행렬곱은 $A(\alpha x+\beta y)=\alpha Ax+\beta Ay$. **선형.**
- **(e) 회전 행렬 $\begin{bmatrix}\cos\theta&\sin\theta\\-\sin\theta&\cos\theta\end{bmatrix}x$:** 고정된 $\theta$에서 상수 행렬이므로 행렬곱. **선형.** (시계 방향 $\theta$ 회전이다.)

---

### 2.17 변환행렬·랭크·핵·상

**문제:** $\Phi(x)=(3x_1+2x_2+x_3,\ x_1+x_2+x_3,\ x_1-3x_2,\ 2x_1+3x_2+x_3)$.

**풀이:** 각 출력 성분의 계수를 행으로 적으면 변환행렬이 된다(열 $j$ = $\Phi(e_j)$).
$$A_\Phi=\begin{bmatrix}3&2&1\\1&1&1\\1&-3&0\\2&3&1\end{bmatrix}$$
소거:
$$\begin{aligned} &\xrightarrow{R_1\leftrightarrow R_2}\begin{bmatrix}1&1&1\\3&2&1\\1&-3&0\\2&3&1\end{bmatrix} \\ &\xrightarrow[R_4-2R_1]{R_2-3R_1,\ R_3-R_1}\begin{bmatrix}1&1&1\\0&-1&-2\\0&-4&-1\\0&1&-1\end{bmatrix} \\ &\xrightarrow[R_4+R_2]{R_3-4R_2}\begin{bmatrix}1&1&1\\0&-1&-2\\0&0&7\\0&0&-3\end{bmatrix} \\ &\xrightarrow{R_4+\frac37R_3}\begin{bmatrix}1&1&1\\0&-1&-2\\0&0&7\\0&0&0\end{bmatrix} \end{aligned}$$
피벗 3개.

**답:**
- $\text{rk}(A_\Phi)=3$
- $\ker\Phi=\{0\}$, $\dim\ker\Phi=0$ (모든 열이 피벗이라 자유변수가 없다. 단사)
- $\text{Im}\,\Phi=\text{span}[(3,1,1,2)^\top,\allowbreak (2,1,-3,3)^\top,\allowbreak (1,1,0,1)^\top]$, $\dim\text{Im}\,\Phi=3$ ($\mathbb R^4$ 안의 3차원 부분공간이라 전사는 아님)
- 확인: $0+3=3=\dim\mathbb R^3$ (정리 2.24)

---

### 2.18 $f\circ g=\text{id}_E$일 때의 핵·상

**문제:** $f\circ g=\text{id}_E$이면 $\ker f=\ker(g\circ f)$, $\text{Im}\,g=\text{Im}(g\circ f)$, $\ker f\cap\text{Im}\,g=\{0_E\}$.

**참고:** 문제는 $f,g$가 자기동형(전단사)이라고 했는데, 그러면 세 식이 모두 자명하다($\ker=\{0\}$, $\text{Im}=E$). 아래 증명은 **선형성과 $f\circ g=\text{id}$만 쓰므로** $f,g$가 그냥 자기사상(endomorphism)이어도 성립한다.

**증명 1. $\ker f=\ker(g\circ f)$:**
- (⊆) $x\in\ker f$이면 $(g\circ f)(x)=g(0)=0$.
- (⊇) $x\in\ker(g\circ f)$, 즉 $g(f(x))=0$이라 하자. 양변에 $f$를 씌우면 $f(g(f(x)))=f(0)=0$. 그런데 $f\circ g=\text{id}$라 왼쪽은 $f(x)$. 따라서 $f(x)=0$.

**증명 2. $\text{Im}\,g=\text{Im}(g\circ f)$:**
- (⊇) $(g\circ f)(x)=g(f(x))$는 $g$의 값이므로 $\text{Im}\,g$에 있다.
- (⊆) $y=g(x)\in\text{Im}\,g$라 하자. $x=f(g(x))$이므로 $y=g(x)=g\big(f(g(x))\big)=(g\circ f)(g(x))\in\text{Im}(g\circ f)$.

**증명 3. $\ker f\cap\text{Im}\,g=\{0_E\}$:** $y$가 교집합에 있으면 $y=g(x)$이고 $f(y)=0$. 그러면 $0=f(y)=f(g(x))=x$, 따라서 $y=g(0)=0$. 반대로 $0$은 두 집합 모두에 있다. ∎

---

### 2.19 핵·상과 기저 변환

**문제:** $A_\Phi=\begin{bmatrix}1&1&0\\1&-1&0\\1&1&1\end{bmatrix}$. (a) $\ker\Phi$, $\text{Im}\,\Phi$. (b) 기저 $B=\big((1,1,1),(1,2,1),(1,0,0)\big)$에 대한 변환행렬 $\tilde A_\Phi$.

**풀이 (a):** 3열이 $(0,0,1)$뿐이라 3열로 전개하면 $\det A_\Phi=1\cdot\det\begin{bmatrix}1&1\\1&-1\end{bmatrix}=-2\ne0$. 가역이다.

**답 (a):** **$\ker\Phi=\{0\}$, $\text{Im}\,\Phi=\mathbb R^3$.**

**풀이 (b):** 입력과 출력 공간이 같고 둘 다 기저 $B$로 바꾸므로 $\tilde A_\Phi=B^{-1}A_\Phi B$ (정리 2.20에서 $S=T=B$). 여기서 $B$는 기저 벡터를 **열로** 세운 행렬이다.
$$\begin{gathered} B=\begin{bmatrix}1&1&1\\1&2&0\\1&1&0\end{bmatrix}, \\ B^{-1}=\begin{bmatrix}0&-1&2\\0&1&-1\\1&0&-1\end{bmatrix} \end{gathered}$$
($BB^{-1}$의 각 행을 곱해 보면 $I$가 된다. 예: $B$의 2행 $(1,2,0)$과 $B^{-1}$의 2열 $(-1,1,0)$은 $-1+2=1$.)

먼저 $A_\Phi b_j$를 구하고, 그것을 $B$ 좌표로 바꾼다($B^{-1}$을 곱한다).
- $A_\Phi b_1=A(1,1,1)=(2,0,3)$ → $B^{-1}(2,0,3)=(6,-3,-1)$
- $A_\Phi b_2=A(1,2,1)=(3,-1,4)$ → $B^{-1}(3,-1,4)=(9,-5,-1)$
- $A_\Phi b_3=A(1,0,0)=(1,1,1)$ → $B^{-1}(1,1,1)=(1,0,0)$

**답 (b):**
$$\tilde A_\Phi=B^{-1}A_\Phi B=\begin{bmatrix}6&9&1\\-3&-5&0\\-1&-1&0\end{bmatrix}$$

**확인:** 1열 $(6,-3,-1)$은 $6b_1-3b_2-b_3=(6-3-1,\ 6-6,\ 6-3)=(2,0,3)=Ab_1$. 3열 $(1,0,0)$은 "$\Phi(b_3)=b_1$"이라는 뜻인데 실제로 $A(1,0,0)=(1,1,1)=b_1$이다.

---

### 2.20 두 기저 사이의 변환과 합성

**문제:** $b_1=(2,1)$, $b_2=(-1,-1)$, $b_1'=(2,-2)$, $b_2'=(1,1)$; $B=(b_1,b_2)$, $B'=(b_1',b_2')$.

**(a) 기저임:** $\det[b_1\ b_2]=2(-1)-(-1)(1)=-1\ne0$, $\det[b_1'\ b_2']=2\cdot1-1\cdot(-2)=4\ne0$. 둘 다 일차독립인 2개의 벡터라 $\mathbb R^2$의 기저. (그림: $b_1$은 오른쪽 위, $b_2$는 왼쪽 아래 대각선, $b_1'$은 오른쪽 아래 대각선, $b_2'$은 오른쪽 위 대각선. $b_1'\perp b_2'$이다.)

**(b) $B'$ → $B$ 좌표 변환 $P_1$:** $P_1$의 $j$열 = $b_j'$을 $B$로 쓴 좌표. 행렬로는 $P_1=B^{-1}B'$.
$$\begin{gathered} B^{-1}=\frac1{-1}\begin{bmatrix}-1&1\\-1&2\end{bmatrix}=\begin{bmatrix}1&-1\\1&-2\end{bmatrix}, \\ P_1=\begin{bmatrix}1&-1\\1&-2\end{bmatrix}\begin{bmatrix}2&1\\-2&1\end{bmatrix}=\begin{bmatrix}4&0\\6&-1\end{bmatrix} \end{gathered}$$
**확인:** $4b_1+6b_2=(8-6,\ 4-6)=(2,-2)=b_1'$, $0b_1-1b_2=(1,1)=b_2'$.

**(c)** $c_1=(1,2,-1)$, $c_2=(0,-1,2)$, $c_3=(1,0,-1)$.
- (i) $\det[c_1\ c_2\ c_3]=\det\begin{bmatrix}1&0&1\\2&-1&0\\-1&2&-1\end{bmatrix}=1\cdot(1-0)-0+1\cdot(4-1)=4\ne0$ → 기저.
- (ii) $C$ 좌표 → 표준 좌표: $C$ 좌표 $\alpha$인 벡터는 $\alpha_1c_1+\alpha_2c_2+\alpha_3c_3=C\alpha$. 따라서
$$P_2=\begin{bmatrix}1&0&1\\2&-1&0\\-1&2&-1\end{bmatrix}$$

**(d) $A_\Phi$ ($B$ → $C$):** 주어진 두 식을 더하고 빼서 $\Phi(b_1)$, $\Phi(b_2)$를 따로 구한다(선형성).
- 더하기: $2\Phi(b_1)=(c_2+c_3)+(2c_1-c_2+3c_3)=2c_1+4c_3$ → $\Phi(b_1)=c_1+2c_3$
- 빼기: $2\Phi(b_2)=(c_2+c_3)-(2c_1-c_2+3c_3)=-2c_1+2c_2-2c_3$ → $\Phi(b_2)=-c_1+c_2-c_3$

$C$ 좌표를 열로 적으면
$$A_\Phi=\begin{bmatrix}1&-1\\0&1\\2&-1\end{bmatrix}$$

**(e) $A'$ ($B'$ → $C'$):** $B'$ 좌표 →($P_1$)→ $B$ 좌표 →($A_\Phi$)→ $C$ 좌표 →($P_2$)→ $C'$(표준) 좌표. 오른쪽부터 곱한다.
$$\begin{aligned} &A'=P_2A_\Phi P_1, \\ &A_\Phi P_1 =\begin{bmatrix}1&-1\\0&1\\2&-1\end{bmatrix}\begin{bmatrix}4&0\\6&-1\end{bmatrix} \\ &\quad =\begin{bmatrix}-2&1\\6&-1\\2&1\end{bmatrix} \end{aligned}$$
$$\begin{aligned} A' &=\begin{bmatrix}1&0&1\\2&-1&0\\-1&2&-1\end{bmatrix}\begin{bmatrix}-2&1\\6&-1\\2&1\end{bmatrix} \\ &=\begin{bmatrix}0&2\\-10&3\\12&-4\end{bmatrix} \end{aligned}$$

**(f)** $x$의 $B'$ 좌표가 $(2,3)$.
- (i) $B$ 좌표: $P_1(2,3)^\top=(8,\ 12-3)=(8,9)$. (확인: $2b_1'+3b_2'=(7,-1)$, $8b_1+9b_2=(16-9,\ 8-9)=(7,-1)$.)
- (ii) $\Phi(x)$의 $C$ 좌표: $A_\Phi(8,9)^\top=(8-9,\ 9,\ 16-9)=(-1,9,7)$.
- (iii) $C'$로: $P_2(-1,9,7)^\top=(-1+7,\ -2-9,\ 1+18-7)=(6,-11,12)$. 즉 **$\Phi(x)=6c_1'-11c_2'+12c_3'$.**
- (iv) 직접: $A'(2,3)^\top=(0+6,\ -20+9,\ 24-12)=(6,-11,12)$. 같다.

---

## 3장 해석기하

### 3.1 내적임을 보이기

**문제:** $\langle x,y\rangle:=x_1y_1-(x_1y_2+x_2y_1)+2x_2y_2$가 내적임을 보여라.

**풀이:** 행렬로 쓰면 $\langle x,y\rangle=x^\top Ay$, $A=\begin{bmatrix}1&-1\\-1&2\end{bmatrix}$. 내적은 대칭이고 양의 정부호인 쌍선형 사상이다(정의 3.2, 3.3).
1. **쌍선형:** $x^\top Ay$는 $x$에 대해서도 $y$에 대해서도 선형(행렬곱의 성질).
2. **대칭:** $A^\top=A$이므로 $\langle y,x\rangle=y^\top Ax=(x^\top A^\top y)^\top=x^\top Ay$. (원래 식에서 $x\leftrightarrow y$를 바꿔도 같은 식이 된다.)
3. **양의 정부호:** 완전제곱식으로 바꾼다.
$$\langle x,x\rangle=x_1^2-2x_1x_2+2x_2^2=(x_1-x_2)^2+x_2^2\ge0.$$
0이 되려면 $x_2=0$이고 $x_1-x_2=0$, 즉 $x=0$일 때뿐이다.

**답:** 세 조건을 모두 만족하므로 내적이다.

---

### 3.2 $A=\begin{bmatrix}2&0\\1&2\end{bmatrix}$는 내적을 만드는가

**풀이:** $\langle e_1,e_2\rangle=e_1^\top Ae_2=A_{12}=0$, $\langle e_2,e_1\rangle=A_{21}=1$. 대칭이 아니다.

**답:** **내적이 아니다.** (참고: $x^\top Ax=2x_1^2+x_1x_2+2x_2^2>0$이라 양수성은 만족하지만 대칭성이 깨진다. 내적이 되려면 행렬이 대칭이어야 한다.)

---

### 3.3 거리 계산

**문제:** $x=(1,2,3)$, $y=(-1,-1,0)$의 거리. (a) 점곱 (b) $A=\begin{bmatrix}2&1&0\\1&3&-1\\0&-1&2\end{bmatrix}$에 의한 내적.

**풀이:** 거리 $d(x,y)=\|x-y\|=\sqrt{\langle x-y,x-y\rangle}$. $d:=x-y=(2,3,3)$.
- (a) $\sqrt{4+9+9}=\sqrt{22}\approx4.690$
- (b) $Ad=(2\cdot2+1\cdot3,\ 1\cdot2+3\cdot3-1\cdot3,\ -1\cdot3+2\cdot3)=(7,8,3)$, $d^\top Ad=14+24+9=47$ → $\sqrt{47}\approx6.856$

**답:** (a) **$\sqrt{22}$** (b) **$\sqrt{47}$**. 같은 두 점이라도 내적이 바뀌면 거리가 바뀐다.

---

### 3.4 각도 계산

**문제:** $x=(1,2)$, $y=(-1,-1)$. (a) 점곱 (b) $B=\begin{bmatrix}2&1\\1&3\end{bmatrix}$.

**풀이:** $\cos\omega=\dfrac{\langle x,y\rangle}{\sqrt{\langle x,x\rangle\langle y,y\rangle}}$.
- (a) $\langle x,y\rangle=-1-2=-3$, $\|x\|^2=5$, $\|y\|^2=2$. $\cos\omega=\dfrac{-3}{\sqrt{10}}\approx-0.9487$.
- (b) $Bx=(4,7)$, $By=(-3,-4)$. $x^\top By=-3-8=-11$, $x^\top Bx=4+14=18$, $y^\top By=3+4=7$. $\cos\omega=\dfrac{-11}{\sqrt{126}}=-\dfrac{11}{3\sqrt{14}}\approx-0.9800$.

**답:** (a) **$\omega=\arccos(-3/\sqrt{10})\approx2.82$ rad $\approx161.6^\circ$** (b) **$\omega=\arccos(-11/\sqrt{126})\approx2.94$ rad $\approx168.5^\circ$**.

---

### 3.5 부분공간으로의 직교사영과 거리

**문제:** $U=\text{span}[u_1,u_2,u_3,u_4]\subseteq\mathbb R^5$ (점곱), $u_1=(0,-1,2,0,2)$, $u_2=(1,-3,1,-1,2)$, $u_3=(-3,4,1,2,1)$, $u_4=(-1,-3,5,0,7)$, $x=(-1,-9,-1,4,1)$. (a) $\pi_U(x)$ (b) $d(x,U)$.

**풀이:**
**1단계: 기저를 고른다.** $[u_1\ u_2\ u_3\ u_4]$를 소거하면 랭크 3이고 $u_4=u_1+2u_2+u_3$이다. (확인: $u_1+2u_2+u_3=(0+2-3,\ -1-6+4,\ 2+2+1,\ 0-2+2,\ 2+4+1)=(-1,-3,5,0,7)$.) 기저 행렬 $B=[u_1\ u_2\ u_3]$.

**2단계: 정규방정식 $B^\top B\lambda=B^\top x$** (식 3.57의 $\lambda=(B^\top B)^{-1}B^\top x$).
$$\begin{gathered} B^\top B=\begin{bmatrix}9&9&0\\9&16&-14\\0&-14&31\end{bmatrix}, \\ B^\top x=\begin{bmatrix}9\\23\\-25\end{bmatrix} \end{gathered}$$
(예: $u_2\cdot u_3=-3-12+1-2+2=-14$, $u_3\cdot x=3-36-1+8+1=-25$.)

**3단계: 푼다.**
- 1식 $9\lambda_1+9\lambda_2=9$ → $\lambda_1=1-\lambda_2$
- 2식 $9(1-\lambda_2)+16\lambda_2-14\lambda_3=23$ → $7\lambda_2-14\lambda_3=14$ → $\lambda_2=2+2\lambda_3$
- 3식 $-14(2+2\lambda_3)+31\lambda_3=-25$ → $3\lambda_3=3$ → $\lambda_3=1$, $\lambda_2=4$, $\lambda_1=-3$

**4단계: 사영.** $\pi_U(x)=-3u_1+4u_2+u_3=(0+4-3,\ 3-12+4,\ -6+4+1,\ 0-4+2,\ -6+8+1)$.

**답 (a):** **$\pi_U(x)=(1,-5,-1,-2,3)^\top$.**

**풀이 (b):** $x-\pi_U(x)=(-2,-4,0,6,-2)$. 제곱합 $4+16+0+36+4=60$.

**답 (b):** **$d(x,U)=\sqrt{60}=2\sqrt{15}\approx7.75$.**

**확인:** 오차 벡터 $(-2,-4,0,6,-2)$는 $u_1,u_2,u_3$ 모두와 직교한다. 예: $u_1$과 $0+4+0+0-4=0$, $u_3$과 $6-16+0+12-2=0$.

---

### 3.6 일반 내적에서의 사영

**문제:** $\langle x,y\rangle=x^\top Ay$, $A=\begin{bmatrix}2&1&0\\1&2&-1\\0&-1&2\end{bmatrix}$. (a) $e_2$를 $U=\text{span}[e_1,e_3]$에 사영 (b) $d(e_2,U)$ (c) 그림.

**풀이 (a):** $\pi_U(e_2)=\lambda_1e_1+\lambda_3e_3$으로 두고, **이 내적으로** 오차가 $U$와 직교하게 한다. 기저 벡터끼리의 내적은 $\langle e_i,e_j\rangle=A_{ij}$.
- $\langle e_2-\lambda_1e_1-\lambda_3e_3,\ e_1\rangle=A_{21}-\lambda_1A_{11}-\lambda_3A_{31}=1-2\lambda_1-0=0$ → $\lambda_1=\tfrac12$
- $\langle e_2-\lambda_1e_1-\lambda_3e_3,\ e_3\rangle=A_{23}-\lambda_1A_{13}-\lambda_3A_{33}=-1-0-2\lambda_3=0$ → $\lambda_3=-\tfrac12$

**답 (a):** **$\pi_U(e_2)=\left(\tfrac12,\ 0,\ -\tfrac12\right)^\top$.**

**풀이 (b):** $r=e_2-\pi_U(e_2)=(-\tfrac12,1,\tfrac12)$. $Ar=(-1+1+0,\ -\tfrac12+2-\tfrac12,\ 0-1+1)=(0,1,0)$, $r^\top Ar=1$.

**답 (b):** **$d(e_2,U)=\sqrt{r^\top Ar}=1$.**

**(c) 그림 설명:** $U$는 $x_1x_3$ 평면이다. 점곱이었다면 $e_2$가 평면에 수직이라 사영은 원점이 된다. 하지만 이 내적에서는 $e_2$가 $e_1$, $e_3$과 직교하지 않으므로($\langle e_2,e_1\rangle=1$, $\langle e_2,e_3\rangle=-1$) 사영이 평면 위의 점 $(\tfrac12,0,-\tfrac12)$로 간다. "수직"의 뜻이 내적에 따라 바뀐다는 것이 이 문제의 요점이다.

---

### 3.7 $\pi$와 $\text{id}-\pi$

**문제:** (a) $\pi$가 사영 ⇔ $\text{id}_V-\pi$가 사영. (b) $\pi$가 사영일 때 $\text{Im}(\text{id}-\pi)$, $\ker(\text{id}-\pi)$를 $\text{Im}\,\pi$, $\ker\pi$로 나타내라.

**정의(정의 3.10):** 선형사상 $\pi$가 사영 ⇔ $\pi^2=\pi\circ\pi=\pi$.

**풀이 (a):** $(\text{id}-\pi)^2=\text{id}-2\pi+\pi^2$.
- (⇒) $\pi^2=\pi$이면 $(\text{id}-\pi)^2=\text{id}-2\pi+\pi=\text{id}-\pi$.
- (⇐) $(\text{id}-\pi)^2=\text{id}-\pi$이면 $\text{id}-2\pi+\pi^2=\text{id}-\pi$ → $\pi^2=\pi$.

**풀이 (b):**
- **$\text{Im}(\text{id}-\pi)=\ker\pi$:** $y=(\text{id}-\pi)x$이면 $\pi y=\pi x-\pi^2x=0$이라 $y\in\ker\pi$. 반대로 $x\in\ker\pi$이면 $(\text{id}-\pi)x=x-0=x$라 $x\in\text{Im}(\text{id}-\pi)$.
- **$\ker(\text{id}-\pi)=\text{Im}\,\pi$:** $(\text{id}-\pi)x=0$ ⇔ $x=\pi x$이므로 $x\in\text{Im}\,\pi$. 반대로 $y=\pi x$이면 $(\text{id}-\pi)y=\pi x-\pi^2x=0$.

**답:** **$\text{Im}(\text{id}-\pi)=\ker\pi$, $\ker(\text{id}-\pi)=\text{Im}\,\pi$.** (직관: $\pi$가 $U$로의 사영이면 $\text{id}-\pi$는 "남은 부분"으로의 사영이다. 3.5에서 $x-\pi_U(x)$가 그 남은 부분이었다.)

---

### 3.8 그람-슈미트

**문제:** $b_1=(1,1,1)$, $b_2=(-1,2,0)$을 정규직교기저로.

**풀이:**
1. $c_1=\dfrac{b_1}{\|b_1\|}=\dfrac1{\sqrt3}(1,1,1)$.
2. $b_2$에서 $b_1$ 방향 성분을 뺀다: $u_2=b_2-\dfrac{b_2^\top b_1}{b_1^\top b_1}b_1=(-1,2,0)-\dfrac13(1,1,1)=\left(-\tfrac43,\ \tfrac53,\ -\tfrac13\right)$.
3. 정규화: $\|u_2\|=\tfrac13\sqrt{16+25+1}=\tfrac{\sqrt{42}}3$, $c_2=\dfrac{1}{\sqrt{42}}(-4,5,-1)$.

**답:** **$c_1=\tfrac1{\sqrt3}(1,1,1)^\top$, $c_2=\tfrac1{\sqrt{42}}(-4,5,-1)^\top$.**

**확인:** $c_1^\top c_2\propto-4+5-1=0$, 길이는 각각 1.

---

### 3.9 코시-슈바르츠 응용

**문제:** $x_i>0$, $\sum x_i=1$일 때 (a) $\sum x_i^2\ge\frac1n$ (b) $\sum\frac1{x_i}\ge n^2$.

**도구:** 코시-슈바르츠 부등식 $|\langle a,b\rangle|\le\|a\|\,\|b\|$ (점곱).

**풀이 (a):** $a=(x_1,\dots,x_n)$, $b=(1,\dots,1)$. $\langle a,b\rangle=\sum x_i=1$, $\|b\|=\sqrt n$.
$$1\le\sqrt{\textstyle\sum x_i^2}\cdot\sqrt n\ \Rightarrow\ \sum x_i^2\ge\frac1n.$$

**풀이 (b):** $a=(\sqrt{x_1},\dots,\sqrt{x_n})$, $b=\left(\tfrac1{\sqrt{x_1}},\dots,\tfrac1{\sqrt{x_n}}\right)$ ($x_i>0$이라 정의된다). $\langle a,b\rangle=\sum1=n$, $\|a\|^2=\sum x_i=1$, $\|b\|^2=\sum\frac1{x_i}$.
$$n\le1\cdot\sqrt{\textstyle\sum\frac1{x_i}}\ \Rightarrow\ \sum\frac1{x_i}\ge n^2.$$

**등호:** 두 경우 모두 $a\parallel b$일 때, 즉 모든 $x_i=\frac1n$일 때 성립한다.

---

### 3.10 30° 회전

**문제:** $x_1=(2,3)$, $x_2=(0,-1)$을 $30^\circ$ 회전.

**풀이:** 반시계 방향 회전 행렬 $R(\theta)=\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$, $\theta=30^\circ$: $R=\begin{bmatrix}\frac{\sqrt3}2&-\frac12\\\frac12&\frac{\sqrt3}2\end{bmatrix}$.
- $Rx_1=\left(\sqrt3-\tfrac32,\ 1+\tfrac{3\sqrt3}2\right)\approx(0.232,\ 3.598)$
- $Rx_2=\left(\tfrac12,\ -\tfrac{\sqrt3}2\right)\approx(0.5,\ -0.866)$

**답:** 위 두 벡터. (시계 방향으로 해석했다면 $R(-30^\circ)$를 써서 $x_1\to(\sqrt3+\tfrac32,\ -1+\tfrac{3\sqrt3}2)$, $x_2\to(-\tfrac12,-\tfrac{\sqrt3}2)$. 교재 3.9절의 회전은 반시계 방향이다.)

**확인:** 회전은 길이를 보존한다. $\|x_1\|^2=13$, $0.232^2+3.598^2\approx13.0$.

---

## 4장 행렬분해

### 4.1 라플라스 전개와 사뤼스 규칙

**문제:** $A=\begin{bmatrix}1&3&5\\2&4&6\\0&2&4\end{bmatrix}$의 행렬식.

**풀이 (라플라스, 1행 전개, 정리 4.2):**
$$\begin{aligned} &\det A \\ &\quad =1\cdot\begin{vmatrix}4&6\\2&4\end{vmatrix}-3\cdot\begin{vmatrix}2&6\\0&4\end{vmatrix}+5\cdot\begin{vmatrix}2&4\\0&2\end{vmatrix} \\ &\quad =1(16-12)-3(8-0)+5(4-0) \\ &\quad =4-24+20 =0. \end{aligned}$$

**풀이 (사뤼스):** 오른쪽 아래 대각선 곱의 합 − 왼쪽 아래 대각선 곱의 합.
$$\begin{aligned} &(1\cdot4\cdot4+3\cdot6\cdot0+5\cdot2\cdot2) \\ &\quad -(0\cdot4\cdot5+2\cdot6\cdot1+4\cdot2\cdot3) \\ &\quad =(16+0+20)-(0+12+24) \\ &\quad =0. \end{aligned}$$

**답:** **$\det A=0$.** (이유: 1열 − 2×2열 + 3열 $=(1-6+5,\ 2-8+6,\ 0-4+4)=0$이라 열이 일차종속.)

---

### 4.2 5×5 행렬식을 효율적으로

**문제:** $\begin{bmatrix}2&0&1&2&0\\2&-1&0&1&1\\0&1&2&1&2\\-2&0&2&-1&2\\2&0&0&1&1\end{bmatrix}$.

**풀이:** 0이 많은 열을 만들어 전개한다. 2열은 $(0,-1,1,0,0)$이라 거의 비어 있다.
1. $R_3\leftarrow R_3+R_2$ (행렬식 불변): 3행이 $(2,0,2,2,3)$이 되어 2열에는 $(2,2)$ 원소 $-1$만 남는다.
2. 2열로 전개: 부호 $(-1)^{2+2}=+1$.
$$\det=(-1)\cdot\det\begin{bmatrix}2&1&2&0\\2&2&2&3\\-2&2&-1&2\\2&0&1&1\end{bmatrix}$$
3. 4×4에서 1열을 정리: $R_2-R_1=(0,1,0,3)$, $R_3+R_1=(0,3,1,2)$, $R_4-R_1=(0,-1,-1,1)$. 1열로 전개.
$$=(-1)\cdot2\cdot\det\begin{bmatrix}1&0&3\\3&1&2\\-1&-1&1\end{bmatrix}=(-2)\big[1(1+2)-0+3(-3+1)\big]=(-2)(3-6)=6.$$

**답:** **6.**

---

### 4.3 고유공간

**(a)** $A=\begin{bmatrix}1&0\\1&1\end{bmatrix}$.

**풀이:** 삼각행렬이라 $p(\lambda)=(1-\lambda)^2$, 고유값 $\lambda=1$ (대수적 중복도 2). $A-I=\begin{bmatrix}0&0\\1&0\end{bmatrix}$ → $x_1=0$.

**답:** **$E_1=\text{span}[(0,1)^\top]$** (기하적 중복도 1 < 2라 대각화 불가. 전단(shear) 사상이다).

**(b)** $B=\begin{bmatrix}-2&2\\2&1\end{bmatrix}$.

**풀이:** $p(\lambda)=(-2-\lambda)(1-\lambda)-4=\lambda^2+\lambda-6=(\lambda+3)(\lambda-2)$.
- $\lambda=2$: $B-2I=\begin{bmatrix}-4&2\\2&-1\end{bmatrix}$ → $x_2=2x_1$ → $E_2=\text{span}[(1,2)^\top]$
- $\lambda=-3$: $B+3I=\begin{bmatrix}1&2\\2&4\end{bmatrix}$ → $x_1=-2x_2$ → $E_{-3}=\text{span}[(2,-1)^\top]$

**답:** 위와 같다. **확인:** $B$가 대칭이라 두 고유벡터가 직교한다($(1,2)\cdot(2,-1)=0$). 대각합 $-1=2+(-3)$, 행렬식 $-6=2\cdot(-3)$.

---

### 4.4 4×4 고유공간

**문제:** $A=\begin{bmatrix}0&-1&1&1\\-1&1&-2&3\\2&-1&0&0\\1&-1&1&0\end{bmatrix}$.

**풀이:**
1. **특성다항식:** 전개하면 $p(\lambda)=\lambda^4-\lambda^3-3\lambda^2+\lambda+2$. 정수근 후보 $\pm1,\pm2$를 넣어 보면 $p(1)=1-1-3+1+2=0$, $p(-1)=1+1-3-1+2=0$, $p(2)=16-8-12+2+2=0$. 인수분해하면
$$p(\lambda)=(\lambda-2)(\lambda-1)(\lambda+1)^2.$$
**빠른 점검:** 고유값 합 $2+1-1-1=1=\text{tr}A=0+1+0+0$ (정리 4.17), 고유값 곱 $2\cdot1\cdot(-1)^2=2=\det A$ (정리 4.16, sympy로 $\det A=2$ 확인).
2. **각 고유공간** ($(A-\lambda I)x=0$을 소거해서 푼다):
   - $\lambda=2$: $E_2=\text{span}[(1,0,1,1)^\top]$. 확인 $A(1,0,1,1)=(2,0,2,2)$.
   - $\lambda=1$: $E_1=\text{span}[(1,1,1,1)^\top]$. 확인 $A(1,1,1,1)=(1,1,1,1)$ (각 행의 합이 1).
   - $\lambda=-1$: $A+I=\begin{bmatrix}1&-1&1&1\\-1&2&-2&3\\2&-1&1&0\\1&-1&1&1\end{bmatrix}$, 랭크 3이라 1차원. $E_{-1}=\text{span}[(0,1,1,0)^\top]$. 확인 $A(0,1,1,0)=(0,-1,-1,0)$.

**답:** 위 세 고유공간. $\lambda=-1$은 대수적 중복도 2, 기하적 중복도 1이라 $A$는 **대각화되지 않는다(결손 행렬, 정의 4.13)**.

---

### 4.5 대각화 가능성과 가역성은 무관하다

| 행렬 | 고유값 | 고유공간 | 대각화 | $\det$ | 가역 |
|---|---|---|---|---|---|
| $\begin{bmatrix}1&0\\0&1\end{bmatrix}$ | 1, 1 | $\mathbb R^2$ 전체 | 가능(이미 대각) | 1 | 가역 |
| $\begin{bmatrix}1&0\\0&0\end{bmatrix}$ | 1, 0 | $\text{span}[e_1]$, $\text{span}[e_2]$ | 가능(이미 대각) | 0 | 불가 |
| $\begin{bmatrix}1&1\\0&1\end{bmatrix}$ | 1, 1 | $\text{span}[e_1]$ (1차원) | 불가 | 1 | 가역 |
| $\begin{bmatrix}0&1\\0&0\end{bmatrix}$ | 0, 0 | $\text{span}[e_1]$ (1차원) | 불가 | 0 | 불가 |

**풀이 요점:** 대각화 여부는 "고유벡터만으로 기저를 만들 수 있는가"(정리 4.20), 가역 여부는 "고유값 0이 있는가"($\det=$ 고유값의 곱)로 정해진다. 네 조합이 모두 나오므로 두 성질은 서로 관계가 없다.

---

### 4.6 고유공간과 대각화

**(a)** $A=\begin{bmatrix}2&3&0\\1&4&3\\0&0&1\end{bmatrix}$.

**풀이:** 3행으로 전개하면
$$\begin{aligned} p(\lambda) &=(1-\lambda)\big[(2-\lambda)(4-\lambda)-3\big] \\ &=(1-\lambda)(\lambda^2-6\lambda+5) \\ &=-(\lambda-1)^2(\lambda-5). \end{aligned}$$
- $\lambda=5$: $A-5I=\begin{bmatrix}-3&3&0\\1&-1&3\\0&0&-4\end{bmatrix}$ → $x_3=0$, $x_1=x_2$ → $E_5=\text{span}[(1,1,0)^\top]$
- $\lambda=1$: $A-I=\begin{bmatrix}1&3&0\\1&3&3\\0&0&0\end{bmatrix}\xrightarrow{R_2-R_1}\begin{bmatrix}1&3&0\\0&0&3\\0&0&0\end{bmatrix}$ → $x_3=0$, $x_1=-3x_2$ → $E_1=\text{span}[(-3,1,0)^\top]$

**답:** $\lambda=1$의 대수적 중복도 2, 기하적 중복도 1. 고유벡터가 2개뿐이라 $\mathbb R^3$의 기저를 못 만든다. **대각화 불가.**

**(b)** $A=\begin{bmatrix}1&1&0&0\\0&0&0&0\\0&0&0&0\\0&0&0&0\end{bmatrix}$.

**풀이:** 위삼각이라 고유값은 대각 원소 $1,0,0,0$.
- $\lambda=1$: $A-I$에서 $x_2=0$, $-x_3=0$, $-x_4=0$ → $E_1=\text{span}[e_1]$
- $\lambda=0$: $Ax=0$ ⇔ $x_1+x_2=0$ → $E_0=\text{span}[(1,-1,0,0)^\top,\ e_3,\ e_4]$ (3차원, 랭크 1이라 핵이 3차원)

**답:** 기하적 중복도 = 대수적 중복도(1과 3)라 고유벡터 4개가 기저를 이룬다. **대각화 가능**, $D=\text{diag}(1,0,0,0)$.

---

### 4.7 대각화 판정과 대각형

**(a)** $A=\begin{bmatrix}0&1\\-8&4\end{bmatrix}$.

$p(\lambda)=\lambda^2-4\lambda+8$, 판별식 $16-32=-16<0$ → 고유값 $2\pm2i$.

**답:** 실수 고유값이 없어 **$\mathbb R$에서는 대각화 불가.** (복소수까지 허용하면 서로 다른 두 고유값이라 대각화된다.)

**(b)** $A=\begin{bmatrix}1&1&1\\1&1&1\\1&1&1\end{bmatrix}$.

**풀이:** 랭크 1이라 $\lambda=0$의 고유공간(핵)이 2차원: $x_1+x_2+x_3=0$ → $\text{span}[(1,-1,0),(1,0,-1)]$. 남은 고유값은 대각합 $3$: $A(1,1,1)=(3,3,3)$.

**답:** **대각화 가능**(대칭행렬이라 스펙트럼 정리 4.15로도 보장).
$$\begin{gathered} D=\begin{bmatrix}3&0&0\\0&0&0\\0&0&0\end{bmatrix}, \\ P=\begin{bmatrix}1&1&1\\1&-1&0\\1&0&-1\end{bmatrix},\quad A=PDP^{-1}. \end{gathered}$$
(정규직교 기저를 원하면 $\tfrac1{\sqrt3}(1,1,1)$, $\tfrac1{\sqrt2}(1,-1,0)$, $\tfrac1{\sqrt6}(1,1,-2)$.)

**(c)** $A=\begin{bmatrix}5&4&2&1\\0&1&-1&-1\\-1&-1&3&0\\1&1&-1&2\end{bmatrix}$.

**풀이:** $p(\lambda)=(\lambda-1)(\lambda-2)(\lambda-4)^2$ (점검: 합 $1+2+4+4=11=\text{tr}A$, 곱 $32=\det A$).
- $\lambda=1$: $E_1=\text{span}[(-1,1,0,0)^\top]$
- $\lambda=2$: $E_2=\text{span}[(1,-1,0,1)^\top]$
- $\lambda=4$: $A-4I=\begin{bmatrix}1&4&2&1\\0&-3&-1&-1\\-1&-1&-1&0\\1&1&-1&-2\end{bmatrix}$의 랭크가 3 → $E_4=\text{span}[(1,0,-1,1)^\top]$ (1차원). 확인 $A(1,0,-1,1)=(4,0,-4,4)$.

**답:** $\lambda=4$의 대수적 중복도 2, 기하적 중복도 1. 고유벡터가 3개뿐이라 **대각화 불가.**

**(d)** $A=\begin{bmatrix}5&-6&-6\\-1&4&2\\3&-6&-4\end{bmatrix}$.

**풀이:** $p(\lambda)=-(\lambda-1)(\lambda-2)^2$ (점검: $1+2+2=5=\text{tr}A$, $1\cdot2\cdot2=4=\det A$).
- $\lambda=2$: $A-2I=\begin{bmatrix}3&-6&-6\\-1&2&2\\3&-6&-6\end{bmatrix}$. 모든 행이 $(1,-2,-2)$의 배수라 랭크 1, 식은 $x_1=2x_2+2x_3$. $E_2=\text{span}[(2,1,0)^\top,(2,0,1)^\top]$ (2차원).
- $\lambda=1$: $A-I=\begin{bmatrix}4&-6&-6\\-1&3&2\\3&-6&-5\end{bmatrix}$ → $E_1=\text{span}[(3,-1,3)^\top]$. 확인 $A(3,-1,3)=(15+6-18,\ -3-4+6,\ 9+6-12)=(3,-1,3)$.

**답:** 중복도가 모두 맞아(1=1, 2=2) **대각화 가능.**
$$\begin{gathered} D=\begin{bmatrix}1&0&0\\0&2&0\\0&0&2\end{bmatrix}, \\ P=\begin{bmatrix}3&2&2\\-1&1&0\\3&0&1\end{bmatrix}\ (\det P=-1\ne0), \\ A=PDP^{-1}. \end{gathered}$$
이 고유벡터 기저 $\big((3,-1,3),(2,1,0),(2,0,1)\big)$에서 변환행렬이 대각이 된다.

---

### 4.8 SVD 구하기

**문제:** $A=\begin{bmatrix}3&2&2\\2&3&-2\end{bmatrix}$.

**풀이:** 작은 쪽인 $AA^\top$($2\times2$)부터 고유분해한다.
1. $AA^\top=\begin{bmatrix}17&8\\8&17\end{bmatrix}$. 고유값 $17\pm8$ → $25,9$. 따라서 $\sigma_1=5$, $\sigma_2=3$.
2. 왼쪽 특이벡터: $\lambda=25$ → $u_1=\tfrac1{\sqrt2}(1,1)$, $\lambda=9$ → $u_2=\tfrac1{\sqrt2}(1,-1)$.
3. 오른쪽 특이벡터는 $v_i=\dfrac{1}{\sigma_i}A^\top u_i$ (부호가 저절로 맞는다).
   - $A^\top u_1=\tfrac1{\sqrt2}(5,5,0)$ → $v_1=\tfrac1{\sqrt2}(1,1,0)$
   - $A^\top u_2=\tfrac1{\sqrt2}(1,-1,4)$ → $v_2=\tfrac1{3\sqrt2}(1,-1,4)$
   - $v_3$: $v_1,v_2$에 직교하는 단위벡터(= $A$의 핵). $v_3=\tfrac13(2,-2,-1)$. 확인 $A v_3=\tfrac13(6-4-2,\ 4-6+2)=0$.

**답:**
$$\begin{gathered} A=U\Sigma V^\top,\quad U=\frac1{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}, \\ \Sigma=\begin{bmatrix}5&0&0\\0&3&0\end{bmatrix}, \\ V=\begin{bmatrix}\frac1{\sqrt2}&\frac1{3\sqrt2}&\frac23\\\frac1{\sqrt2}&-\frac1{3\sqrt2}&-\frac23\\0&\frac4{3\sqrt2}&-\frac13\end{bmatrix}. \end{gathered}$$

**확인:** $5u_1v_1^\top+3u_2v_2^\top=\tfrac52\begin{bmatrix}1&1&0\\1&1&0\end{bmatrix}+\tfrac12\begin{bmatrix}1&-1&4\\-1&1&-4\end{bmatrix}=\begin{bmatrix}3&2&2\\2&3&-2\end{bmatrix}$. (특이벡터 부호는 $u_i,v_i$를 함께 뒤집는 한 자유다.)

---

### 4.9 SVD 구하기 (정사각)

**문제:** $A=\begin{bmatrix}2&2\\-1&1\end{bmatrix}$.

**풀이:**
1. $A^\top A=\begin{bmatrix}5&3\\3&5\end{bmatrix}$, 고유값 $8,2$ → $\sigma_1=2\sqrt2$, $\sigma_2=\sqrt2$.
2. $v_1=\tfrac1{\sqrt2}(1,1)$, $v_2=\tfrac1{\sqrt2}(-1,1)$.
3. $u_i=\dfrac1{\sigma_i}Av_i$: $Av_1=\tfrac1{\sqrt2}(4,0)$ → $u_1=(1,0)$; $Av_2=\tfrac1{\sqrt2}(0,2)$ → $u_2=(0,1)$.

**답:**
$$A=\underbrace{\begin{bmatrix}1&0\\0&1\end{bmatrix}}_{U}\underbrace{\begin{bmatrix}2\sqrt2&0\\0&\sqrt2\end{bmatrix}}_{\Sigma}\underbrace{\frac1{\sqrt2}\begin{bmatrix}1&1\\-1&1\end{bmatrix}}_{V^\top}.$$

**확인:** $\Sigma V^\top=\begin{bmatrix}2&2\\-1&1\end{bmatrix}$. ($AA^\top=\text{diag}(8,2)$가 이미 대각이라 $U=I$가 된 것이다.)

---

### 4.10 랭크 1 근사

**문제:** 4.8의 $A$를 랭크 1로 근사.

**풀이:** 에카르트-영 정리(정리 4.25): 가장 큰 특이값 항만 남긴 $\hat A(1)=\sigma_1u_1v_1^\top$가 스펙트럼 노름으로 가장 가까운 랭크 1 행렬이다.
$$\begin{aligned} \hat A(1) &=5\cdot\frac1{\sqrt2}\begin{bmatrix}1\\1\end{bmatrix}\cdot\frac1{\sqrt2}\begin{bmatrix}1&1&0\end{bmatrix} \\ &=\frac52\begin{bmatrix}1&1&0\\1&1&0\end{bmatrix}. \end{aligned}$$

**답:** **$\hat A(1)=\begin{bmatrix}2.5&2.5&0\\2.5&2.5&0\end{bmatrix}$**, 오차 $\|A-\hat A(1)\|_2=\sigma_2=3$.

---

### 4.11 $A^\top A$와 $AA^\top$의 0 아닌 고유값

**증명:** $\lambda\ne0$이 $A^\top A$의 고유값이고 $v\ne0$이 고유벡터라 하자: $A^\top Av=\lambda v$.
1. $Av\ne0$이다. ($Av=0$이면 $\lambda v=A^\top(Av)=0$인데 $\lambda\ne0$, $v\ne0$이라 모순.)
2. $AA^\top(Av)=A(A^\top Av)=A(\lambda v)=\lambda(Av)$.

즉 $Av$는 $AA^\top$의 고유값 $\lambda$에 대한 고유벡터다. $A$와 $A^\top$의 역할을 바꾸면 반대 방향도 같다. 따라서 0 아닌 고유값의 집합이 같다. ∎

**보충:** 중복도까지 같다. $v\mapsto Av$가 $A^\top A$의 $\lambda$-고유공간에서 $AA^\top$의 $\lambda$-고유공간으로 가는 단사 선형사상이기 때문이다($Av=0$이면 1번처럼 $v=0$). SVD로 보면 둘 다 $\sigma_i^2$이다. 0 고유값의 개수는 크기($n$ 대 $m$)가 달라 다를 수 있다.

---

### 4.12 스펙트럼 노름 = $\sigma_1$ (정리 4.24)

**증명:** SVD $A=U\Sigma V^\top$ ($U,V$ 직교). 직교행렬은 길이를 보존한다($\|Uz\|=\|z\|$).
1. $\|Ax\|_2=\|U\Sigma V^\top x\|_2=\|\Sigma V^\top x\|_2$.
2. $y:=V^\top x$로 두면 $\|y\|_2=\|x\|_2$이고 $x\ne0$ ⇔ $y\ne0$.
3. $\|\Sigma y\|_2^2=\sum_i\sigma_i^2y_i^2\le\sigma_1^2\sum_iy_i^2=\sigma_1^2\|y\|_2^2$ ($\sigma_1$이 가장 크므로).
4. 따라서 모든 $x\ne0$에서 $\dfrac{\|Ax\|_2}{\|x\|_2}\le\sigma_1$.
5. 등호: $x=v_1$이면 $Av_1=\sigma_1u_1$이라 $\dfrac{\|Av_1\|}{\|v_1\|}=\sigma_1$.

**결론:** $\displaystyle\max_{x\ne0}\frac{\|Ax\|_2}{\|x\|_2}=\sigma_1$. ∎ (4.8의 행렬이라면 $(1,1,0)$ 방향을 5배로 늘이는 것이 최대.)

---

## 5장 벡터 미적분

### 5.1 $f(x)=\log(x^4)\sin(x^3)$

**풀이:** 곱의 법칙 $(uv)'=u'v+uv'$.
- $u=\log(x^4)$: 연쇄법칙으로 $u'=\dfrac{1}{x^4}\cdot4x^3=\dfrac4x$
- $v=\sin(x^3)$: $v'=\cos(x^3)\cdot3x^2$

**답:**
$$\begin{aligned} f'(x) &=\frac4x\sin(x^3) \\ &\quad +3x^2\log(x^4)\cos(x^3) \\ &\Big(=\frac4x\sin(x^3) \\ &\quad +12x^2\log|x|\cos(x^3)\Big). \end{aligned}$$

---

### 5.2 로지스틱 시그모이드

**풀이:** $f(x)=(1+e^{-x})^{-1}$. 바깥 $u^{-1}$, 안쪽 $u=1+e^{-x}$.
$$\begin{aligned} f'(x) &=-(1+e^{-x})^{-2}\cdot(-e^{-x}) \\ &=\frac{e^{-x}}{(1+e^{-x})^2}. \end{aligned}$$
정리하면 $\dfrac{1}{1+e^{-x}}\cdot\dfrac{e^{-x}}{1+e^{-x}}=f(x)\big(1-f(x)\big)$ ($1-f=\frac{e^{-x}}{1+e^{-x}}$이므로).

**답:** **$f'(x)=\dfrac{e^{-x}}{(1+e^{-x})^2}=f(x)\big(1-f(x)\big)$.** (최댓값은 $x=0$에서 $\tfrac14$. 이 식은 로지스틱 회귀와 신경망 역전파에서 계속 쓰인다.)

---

### 5.3 가우스 꼴 함수

**풀이:** $f(x)=\exp(g(x))$, $g(x)=-\dfrac{(x-\mu)^2}{2\sigma^2}$, $g'(x)=-\dfrac{2(x-\mu)}{2\sigma^2}=-\dfrac{x-\mu}{\sigma^2}$.

**답:** **$f'(x)=-\dfrac{x-\mu}{\sigma^2}\exp\!\Big(-\dfrac{(x-\mu)^2}{2\sigma^2}\Big)$.** ($x=\mu$에서 0이 되어 최댓값, $x<\mu$에서 증가, $x>\mu$에서 감소.)

---

### 5.4 $\sin x+\cos x$의 테일러 다항식

**풀이:** 도함수가 4번 미분마다 되풀이된다.

| $k$ | $f^{(k)}(x)$ | $f^{(k)}(0)$ |
|---|---|---|
| 0 | $\sin x+\cos x$ | 1 |
| 1 | $\cos x-\sin x$ | 1 |
| 2 | $-\sin x-\cos x$ | −1 |
| 3 | $-\cos x+\sin x$ | −1 |
| 4 | $\sin x+\cos x$ | 1 |
| 5 | $\cos x-\sin x$ | 1 |

$T_n(x)=\sum_{k=0}^n\dfrac{f^{(k)}(0)}{k!}x^k$.

**답:**
- $T_0=1$
- $T_1=1+x$
- $T_2=1+x-\dfrac{x^2}2$
- $T_3=1+x-\dfrac{x^2}2-\dfrac{x^3}6$
- $T_4=1+x-\dfrac{x^2}2-\dfrac{x^3}6+\dfrac{x^4}{24}$
- $T_5=1+x-\dfrac{x^2}2-\dfrac{x^3}6+\dfrac{x^4}{24}+\dfrac{x^5}{120}$

(sin의 급수 $x-\frac{x^3}6+\frac{x^5}{120}$과 cos의 급수 $1-\frac{x^2}2+\frac{x^4}{24}$를 더한 것과 같다.)

---

### 5.5 편미분의 크기와 야코비안

**문제:** $f_1(x)=\sin x_1\cos x_2$ ($x\in\mathbb R^2$), $f_2(x,y)=x^\top y$ ($x,y\in\mathbb R^n$), $f_3(x)=xx^\top$ ($x\in\mathbb R^n$). (a) $\partial f_i/\partial x$의 크기 (b) 야코비안.

**크기 규칙:** $f:\mathbb R^N\to\mathbb R^M$이면 $\dfrac{df}{dx}$는 $M\times N$ (출력 개수 × 입력 개수).

**풀이 (a):**
- $f_1:\mathbb R^2\to\mathbb R$ → $1\times2$
- $f_2:\mathbb R^{2n}\to\mathbb R$ ($x,y$를 함께 입력으로 보면) → $1\times2n$. 따로 보면 $\partial f_2/\partial x$, $\partial f_2/\partial y$가 각각 $1\times n$
- $f_3:\mathbb R^n\to\mathbb R^{n\times n}$ → $(n\times n)\times n$ 텐서 (출력이 행렬이라 3차원 배열)

**풀이 (b):**
- $f_1$: $\dfrac{\partial f_1}{\partial x}=\begin{bmatrix}\cos x_1\cos x_2&-\sin x_1\sin x_2\end{bmatrix}$
- $f_2=\sum_ix_iy_i$: $\dfrac{\partial f_2}{\partial x}=y^\top$, $\dfrac{\partial f_2}{\partial y}=x^\top$ (식 5.104, 5.105). 합치면 $\dfrac{\partial f_2}{\partial(x,y)}=\begin{bmatrix}y^\top&x^\top\end{bmatrix}\in\mathbb R^{1\times2n}$
- $f_3$: 성분 $(xx^\top)_{ij}=x_ix_j$이므로
$$\frac{\partial(xx^\top)_{ij}}{\partial x_k}=\delta_{ik}x_j+x_i\delta_{jk}.$$
$k$번째 "조각"(입력 $x_k$에 대한 $n\times n$ 행렬)으로 쓰면 $\dfrac{\partial f_3}{\partial x_k}=e_kx^\top+xe_k^\top$. 이 $n$개의 $n\times n$ 행렬을 쌓은 것이 $(n\times n)\times n$ 야코비안이다.
  - 예($n=2$): $\dfrac{\partial f_3}{\partial x_1}=\begin{bmatrix}2x_1&x_2\\x_2&0\end{bmatrix}$, $\dfrac{\partial f_3}{\partial x_2}=\begin{bmatrix}0&x_1\\x_1&2x_2\end{bmatrix}$.
  - (교재 밖 보충) 출력을 벡터로 펴서 $\text{vec}(xx^\top)\in\mathbb R^{n^2}$로 보면 야코비안은 $n^2\times n$ 행렬 $x\otimes I_n+I_n\otimes x$.

---

### 5.6 벡터·행렬에 대한 미분

**문제:** $f(t)=\sin(\log(t^\top t))$를 $t\in\mathbb R^D$로, $g(X)=\text{tr}(AXB)$를 $X\in\mathbb R^{E\times F}$로 미분 ($A\in\mathbb R^{D\times E}$, $B\in\mathbb R^{F\times D}$).

**풀이 ($f$):** 연쇄법칙. $z=t^\top t$ (스칼라), $w=\log z$, $f=\sin w$.
- $\dfrac{df}{dw}=\cos w$, $\dfrac{dw}{dz}=\dfrac1z$, $\dfrac{dz}{dt}=2t^\top$ ($1\times D$)

**답 ($f$):**
$$\frac{df}{dt}=\cos\big(\log(t^\top t)\big)\cdot\frac{2t^\top}{t^\top t}\in\mathbb R^{1\times D}.$$

**풀이 ($g$):** 대각합을 성분으로 풀어 쓴다.
$$\begin{aligned} g(X) &=\sum_{i=1}^D(AXB)_{ii} \\ &=\sum_{i}\sum_{e,f}A_{ie}X_{ef}B_{fi}. \end{aligned}$$
$X_{ef}$로 미분하면 그 항의 계수만 남는다.
$$\begin{aligned} &\frac{\partial g}{\partial X_{ef}} =\sum_iA_{ie}B_{fi} \\ &\quad =\sum_i(A^\top)_{ei}(B^\top)_{if} =(A^\top B^\top)_{ef}. \end{aligned}$$
(같은 결과를 식 5.106으로도 얻는다: $\text{tr}(AXB)=\sum_ia_i^\top Xb_i$, 여기서 $a_i^\top$는 $A$의 $i$행, $b_i$는 $B$의 $i$열. 각 항의 미분이 $a_ib_i^\top$이고 합하면 $A^\top B^\top$.)

**답 ($g$):** **$\dfrac{\partial g}{\partial X}=A^\top B^\top\in\mathbb R^{E\times F}$** ($X$와 같은 크기). 수치 미분으로 확인했다.

---

### 5.7 연쇄법칙과 각 편미분의 크기

**(a)** $f(z)=\log(1+z)$, $z=x^\top x$, $x\in\mathbb R^D$.

| 편미분 | 값 | 크기 |
|---|---|---|
| $\dfrac{\partial f}{\partial z}$ | $\dfrac1{1+z}$ | $1\times1$ |
| $\dfrac{\partial z}{\partial x}$ | $2x^\top$ | $1\times D$ |

**답:** $\dfrac{df}{dx}=\dfrac{\partial f}{\partial z}\dfrac{\partial z}{\partial x}=\dfrac{2x^\top}{1+x^\top x}\in\mathbb R^{1\times D}$.

**(b)** $f(z)=\sin(z)$ (성분별), $z=Ax+b$, $A\in\mathbb R^{E\times D}$, $x\in\mathbb R^D$, $b\in\mathbb R^E$.

| 편미분 | 값 | 크기 |
|---|---|---|
| $\dfrac{\partial f}{\partial z}$ | $\text{diag}(\cos z_1,\dots,\cos z_E)$ | $E\times E$ |
| $\dfrac{\partial z}{\partial x}$ | $A$ | $E\times D$ |

$f_i=\sin z_i$는 $z_i$에만 의존하므로 $\partial f_i/\partial z_j$는 $i=j$일 때만 $\cos z_i$이고 나머지는 0이다. 그래서 대각행렬이 된다.

**답:** $\dfrac{df}{dx}=\text{diag}\big(\cos(Ax+b)\big)\,A\in\mathbb R^{E\times D}$. 성분으로는 $\dfrac{\partial f_i}{\partial x_j}=\cos(a_i^\top x+b_i)A_{ij}$.

---

### 5.8 미분 (가우스 꼴, 대각합, tanh)

**(a)** $f(z)=\exp(-\tfrac12z)$, $z=y^\top S^{-1}y$, $y=x-\mu$ ($x,\mu\in\mathbb R^D$, $S\in\mathbb R^{D\times D}$).

| 편미분 | 값 | 크기 |
|---|---|---|
| $\dfrac{\partial f}{\partial z}$ | $-\tfrac12\exp(-\tfrac12z)$ | $1\times1$ |
| $\dfrac{\partial z}{\partial y}$ | $y^\top\big(S^{-1}+S^{-\top}\big)$ (식 5.107) | $1\times D$ |
| $\dfrac{\partial y}{\partial x}$ | $I_D$ | $D\times D$ |

**답:**
$$\begin{aligned} \frac{df}{dx} &=-\frac12\exp\!\Big(-\frac12(x-\mu)^\top S^{-1} \\ &\quad (x-\mu) \Big) (x-\mu)^\top \big(S^{-1} \\ &\quad +S^{-\top}\big)\in\mathbb R^{1\times D}. \end{aligned}$$
$S$가 대칭(공분산 행렬처럼)이면 $S^{-1}+S^{-\top}=2S^{-1}$이라 $\dfrac{df}{dx}=-f(x)\,(x-\mu)^\top S^{-1}$. (가우스 밀도의 기울기: 평균에서 멀수록, 분산이 작을수록 가파르다.)

**(b)** $f(x)=\text{tr}(xx^\top+\sigma^2I)$, $x\in\mathbb R^D$.

**풀이:** 힌트대로 외적을 풀어 쓴다. $xx^\top$의 대각 원소는 $x_i^2$, $\sigma^2I$의 대각 원소는 $\sigma^2$.
$$f(x)=\sum_{i=1}^D(x_i^2+\sigma^2)=x^\top x+D\sigma^2.$$

**답:** **$\dfrac{df}{dx}=2x^\top\in\mathbb R^{1\times D}$.**

**(c)** $f=\tanh(z)\in\mathbb R^M$ (성분별), $z=Ax+b$, $x\in\mathbb R^N$, $A\in\mathbb R^{M\times N}$, $b\in\mathbb R^M$.

| 편미분 | 값 | 크기 |
|---|---|---|
| $\dfrac{\partial f}{\partial z}$ | $\text{diag}\big(1-\tanh^2(z_1),\dots,1-\tanh^2(z_M)\big)$ | $M\times M$ |
| $\dfrac{\partial z}{\partial x}$ | $A$ | $M\times N$ |

($\tanh'(u)=1-\tanh^2(u)$.)

**답:** $\dfrac{df}{dx}=\dfrac{\partial f}{\partial z}\dfrac{\partial z}{\partial x}\in\mathbb R^{M\times N}$. (문제는 곱까지 계산하지 않아도 된다고 했다. 곱하면 $\text{diag}(1-\tanh^2(Ax+b))A$로, 신경망 한 층의 야코비안이다.)

---

### 5.9 재매개변수화된 함수의 기울기

**문제:** $g(x,z,\nu):=\log p(x,z)-\log q(z,\nu)$, $z:=t(\epsilon,\nu)$ ($x\in\mathbb R^D$, $z\in\mathbb R^E$, $\nu\in\mathbb R^F$, $\epsilon\in\mathbb R^G$). $\dfrac{d}{d\nu}g(x,z,\nu)$를 구하라.

**풀이:** $\nu$는 두 길로 $g$에 들어간다. ① $q(z,\nu)$의 두 번째 인자로 **직접**, ② $z=t(\epsilon,\nu)$를 통해 **간접**으로. $x$와 $\epsilon$은 $\nu$와 무관한 상수다. 전미분은 두 길의 합이다.
$$\frac{dg}{d\nu}=\underbrace{\frac{\partial g}{\partial z}}_{1\times E}\ \underbrace{\frac{\partial z}{\partial\nu}}_{E\times F}+\underbrace{\frac{\partial g}{\partial\nu}}_{1\times F}.$$
각 조각:
- $\dfrac{\partial g}{\partial z}=\dfrac{\partial\log p(x,z)}{\partial z}-\dfrac{\partial\log q(z,\nu)}{\partial z}$
- $\dfrac{\partial z}{\partial\nu}=\dfrac{\partial t(\epsilon,\nu)}{\partial\nu}$
- $\dfrac{\partial g}{\partial\nu}=-\dfrac{\partial\log q(z,\nu)}{\partial\nu}$ ($\log p$는 $\nu$를 직접 갖지 않는다)

**답:**
$$\begin{aligned} &\frac{d}{d\nu}g =\biggl(\frac{\partial\log p(x,z)}{\partial z} \\ &\quad -\frac{\partial\log q(z,\nu)}{\partial z}\biggr)\frac{\partial t(\epsilon,\nu)}{\partial\nu} \\ &\quad -\frac{\partial\log q(z,\nu)}{\partial\nu}\ \in\mathbb R^{1\times F}, \\ &z=t(\epsilon,\nu). \end{aligned}$$

**배경:** 변분 추론에서 쓰는 재매개변수화 기법(reparameterization trick)이다. 예를 들어 $z=\mu+\sigma\odot\epsilon$, $\nu=(\mu,\sigma)$로 두면 무작위성은 $\epsilon$에만 있어서 $\nu$에 대해 미분할 수 있다. 각 항의 크기를 맞춰 보면 $(1\times E)(E\times F)+(1\times F)=1\times F$로 일관된다.

---

## 6장 확률과 분포

> **검산:** 6.1·6.2·6.4의 숫자는 scipy로 다시 계산해 확인했다(6.2의 최빈값·중앙값 포함). 교재 인용은 합의 법칙 (6.20), 곱의 법칙 (6.22), 베이즈 정리 (6.23), 베타 분포 (6.98), 가우시안 조건부 (6.65)~(6.67)이다.

---

### 6.1 이산 결합분포의 주변분포와 조건부 확률

**문제:**  
두 이산확률변수 $X \in \{x_1, x_2, x_3, x_4, x_5\}$, $Y \in \{y_1, y_2, y_3\}$의 결합확률질량함수 $p(x, y)$가 주어졌을 때 다음을 구하라.  
(a) 주변분포 $p(x)$와 $p(y)$  
(b) 조건부 분포 $p(x \mid Y = y_1)$과 $p(y \mid X = x_3)$  

결합확률표 $p(x_j, y_i)$:
| $Y \backslash X$ | $x_1$ | $x_2$ | $x_3$ | $x_4$ | $x_5$ |
| :---: | :---: | :---: | :---: | :---: | :---: |
| $y_1$ | $0.01$ | $0.02$ | $0.03$ | $0.10$ | $0.10$ |
| $y_2$ | $0.05$ | $0.10$ | $0.05$ | $0.07$ | $0.20$ |
| $y_3$ | $0.10$ | $0.05$ | $0.03$ | $0.05$ | $0.04$ |


**풀이:**

**(a) 주변분포 $p(x)$와 $p(y)$의 계산**  
주변확률은 합의 법칙(Sum Rule, 교재 식 (6.20))에 따라 다른 변수의 모든 가능한 상태에 대해 결합확률을 합산(marginalization)하여 구한다.

1. $X$의 각 상태 $x_j$에 대한 주변확률 $p(x_j) = \sum_{i=1}^3 p(x_j, y_i)$ (각 열의 합):
   - $p(x_1) = p(x_1, y_1) + p(x_1, y_2) + p(x_1, y_3) = 0.01 + 0.05 + 0.10 = 0.16$
   - $p(x_2) = p(x_2, y_1) + p(x_2, y_2) + p(x_2, y_3) = 0.02 + 0.10 + 0.05 = 0.17$
   - $p(x_3) = p(x_3, y_1) + p(x_3, y_2) + p(x_3, y_3) = 0.03 + 0.05 + 0.03 = 0.11$
   - $p(x_4) = p(x_4, y_1) + p(x_4, y_2) + p(x_4, y_3) = 0.10 + 0.07 + 0.05 = 0.22$
   - $p(x_5) = p(x_5, y_1) + p(x_5, y_2) + p(x_5, y_3) = 0.10 + 0.20 + 0.04 = 0.34$

2. $Y$의 각 상태 $y_i$에 대한 주변확률 $p(y_i) = \sum_{j=1}^5 p(x_j, y_i)$ (각 행의 합):
   - $p(y_1) = 0.01 + 0.02 + 0.03 + 0.10 + 0.10 = 0.26$
   - $p(y_2) = 0.05 + 0.10 + 0.05 + 0.07 + 0.20 = 0.47$
   - $p(y_3) = 0.10 + 0.05 + 0.03 + 0.05 + 0.04 = 0.27$

**(b) 조건부 분포 $p(x \mid Y = y_1)$과 $p(y \mid X = x_3)$의 계산**  
조건부 확률은 곱의 법칙(Product Rule, 교재 식 (6.22))을 정리한 정의 $p(a \mid b) = \frac{p(a, b)}{p(b)}$를 적용한다.

1. $Y = y_1$일 때 $X$의 조건부 확률 $p(x_j \mid Y = y_1) = \frac{p(x_j, y_1)}{p(y_1)} = \frac{p(x_j, y_1)}{0.26}$:
   - $p(x_1 \mid Y = y_1) = \frac{0.01}{0.26} = \frac{1}{26} \approx 0.038$
   - $p(x_2 \mid Y = y_1) = \frac{0.02}{0.26} = \frac{2}{26} = \frac{1}{13} \approx 0.077$
   - $p(x_3 \mid Y = y_1) = \frac{0.03}{0.26} = \frac{3}{26} \approx 0.115$
   - $p(x_4 \mid Y = y_1) = \frac{0.10}{0.26} = \frac{10}{26} = \frac{5}{13} \approx 0.385$
   - $p(x_5 \mid Y = y_1) = \frac{0.10}{0.26} = \frac{10}{26} = \frac{5}{13} \approx 0.385$

2. $X = x_3$일 때 $Y$의 조건부 확률 $p(y_i \mid X = x_3) = \frac{p(x_3, y_i)}{p(x_3)} = \frac{p(x_3, y_i)}{0.11}$:
   - $p(y_1 \mid X = x_3) = \frac{0.03}{0.11} = \frac{3}{11} \approx 0.273$
   - $p(y_2 \mid X = x_3) = \frac{0.05}{0.11} = \frac{5}{11} \approx 0.455$
   - $p(y_3 \mid X = x_3) = \frac{0.03}{0.11} = \frac{3}{11} \approx 0.273$

**답:**
- **(a) 주변분포:**  
  $$p(X) = [p(x_1), p(x_2), p(x_3), p(x_4), p(x_5)] = [0.16, 0.17, 0.11, 0.22, 0.34]$$  
  $$p(Y) = [p(y_1), p(y_2), p(y_3)] = [0.26, 0.47, 0.27]$$
- **(b) 조건부 분포:**  
  $$p(X \mid Y = y_1) = \left[ \frac{1}{26}, \frac{2}{26}, \frac{3}{26}, \frac{10}{26}, \frac{10}{26} \right] \approx [0.038, 0.077, 0.115, 0.385, 0.385]$$  
  $$p(Y \mid X = x_3) = \left[ \frac{3}{11}, \frac{5}{11}, \frac{3}{11} \right] \approx [0.273, 0.455, 0.273]$$

**확인:**  
Python 수치 검산 결과,  
$\sum_{j=1}^5 p(x_j) = 0.16 + 0.17 + 0.11 + 0.22 + 0.34 = 1.00$,  
$\sum_{i=1}^3 p(y_i) = 0.26 + 0.47 + 0.27 = 1.00$,  
$\sum_{j=1}^5 p(x_j \mid Y = y_1) = \frac{1+2+3+10+10}{26} = 1.00$,  
$\sum_{i=1}^3 p(y_i \mid X = x_3) = \frac{3+5+3}{11} = 1.00$ 으로 유효한 확률분포임을 확인 완료함.

---

### 6.2 2차원 가우시안 혼합분포의 주변분포·대푯값·최빈값

**문제:**  
다음 2차원 가우시안 혼합분포 $p(\mathbf{x})$를 고려하라.
$$\begin{aligned} p(\mathbf{x}) &= 0.4 \mathcal{N}\left( \mathbf{x} \,\middle|\, \begin{bmatrix} 10 \\ 2 \end{bmatrix}, \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \right) \\ &\quad + 0.6 \mathcal{N}\left( \mathbf{x} \,\middle|\, \begin{bmatrix} 0 \\ 0 \end{bmatrix}, \begin{bmatrix} 8.4 & 2.0 \\ 2.0 & 1.7 \end{bmatrix} \right) \end{aligned}$$
(a) 각 차원 $x_1, x_2$의 주변분포를 구하라.  
(b) 각 주변분포의 평균, 최빈값(mode), 중앙값(median)을 구하라. (수치 계산은 소수 셋째 자리까지 표기)  
(c) 2차원 결합분포 $p(\mathbf{x})$의 평균과 최빈값을 구하라.  

**풀이:**

**(a) 각 차원의 주변분포 계산**
1. 다변량 가우시안 혼합분포의 정의 $p(\mathbf{x}) = \alpha p_1(\mathbf{x}) + (1-\alpha) p_2(\mathbf{x})$에서, 임의의 한 차원에 대한 적분(주변화)은 적분의 선형성에 의해 각 구성요소 가우시안의 주변분포의 가중합이 된다:
   $$p(x_1) = \int_{-\infty}^\infty p(x_1, x_2) \, dx_2 = 0.4 \int_{-\infty}^\infty \mathcal{N}_1(\mathbf{x}) \, dx_2 + 0.6 \int_{-\infty}^\infty \mathcal{N}_2(\mathbf{x}) \, dx_2$$
2. 가우시안 분포의 주변화 성질(교재 6.5.1절)에 따라, 다변량 가우시안 $\mathcal{N}(\boldsymbol{\mu}, \boldsymbol{\Sigma})$의 한 차원 $x_d$의 주변분포는 해당 성분의 평균 $\mu_d$와 대각 공분산 성분 $\Sigma_{dd} = \sigma_d^2$를 모수로 갖는 1차원 가우시안 $\mathcal{N}(\mu_d, \sigma_d^2)$이다.
3. 첫 번째 성분: $\boldsymbol{\mu}_1 = \begin{bmatrix} 10 \\ 2 \end{bmatrix}$, $\boldsymbol{\Sigma}_1 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}$ 이므로 $x_1 \sim \mathcal{N}(10, 1)$, $x_2 \sim \mathcal{N}(2, 1)$.
4. 두 번째 성분: $\boldsymbol{\mu}_2 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$, $\boldsymbol{\Sigma}_2 = \begin{bmatrix} 8.4 & 2.0 \\ 2.0 & 1.7 \end{bmatrix}$ 이므로 $x_1 \sim \mathcal{N}(0, 8.4)$, $x_2 \sim \mathcal{N}(0, 1.7)$.
5. 따라서 두 차원의 주변분포는 각각 다음과 같다:
   $$p(x_1) = 0.4 \mathcal{N}(x_1 \mid 10, 1) + 0.6 \mathcal{N}(x_1 \mid 0, 8.4)$$
   $$p(x_2) = 0.4 \mathcal{N}(x_2 \mid 2, 1) + 0.6 \mathcal{N}(x_2 \mid 0, 1.7)$$

**(b) 각 주변분포의 평균, 최빈값, 중앙값 수치 계산**

1. **$x_1$의 주변분포:**
   - **평균 $\mathbb{E}[x_1]$:** 정리 6.12(교재 식 (6.81))에 의해 각 성분 평균의 가중합이다:
     $$\mathbb{E}[x_1] = 0.4 \times 10 + 0.6 \times 0 = 4.000$$
   - **최빈값 (Mode):** 확률밀도함수 $p(x_1)$의 1차 도함수 $p'(x_1) = 0$인 임계점을 수치 해석으로 탐색한다.
     가우시안 도함수 공식 $\frac{d}{dx}\mathcal{N}(x \mid \mu, \sigma^2) = -\frac{x - \mu}{\sigma^2}\mathcal{N}(x \mid \mu, \sigma^2)$를 적용하면:
     $$p'(x_1) = 0.4 \left(-\frac{x_1 - 10}{1}\right)\mathcal{N}(x_1 \mid 10, 1) + 0.6 \left(-\frac{x_1}{8.4}\right)\mathcal{N}(x_1 \mid 0, 8.4) = 0$$
     이를 수치 계산(Python root-finding)하면 세 임계점이 도출된다:
     - $x_1 \approx 0.000$: 극댓값 (밀도 $p(0.000) \approx 0.083$) $\rightarrow$ **국소 최빈값(Local mode)**
     - $x_1 \approx 6.896$: 극솟값 (밀도 $p(6.896) \approx 0.006$)
     - $x_1 \approx 9.998$: 극댓값 (밀도 $p(9.998) \approx 0.160$) $\rightarrow$ **전역 최빈값(Global mode)**  
     *(이유: 첫 번째 성분의 분산이 $\sigma_1^2 = 1$로 매우 좁아, 분산이 $\sigma_2^2 = 8.4$인 두 번째 성분보다 첨두 높이가 약 2배 높기 때문이다.)*
   - **중앙값 (Median):** 누적분포함수 $F(x_1) = 0.4 \Phi\left(\frac{x_1 - 10}{1}\right) + 0.6 \Phi\left(\frac{x_1}{\sqrt{8.4}}\right) = 0.5$가 되는 $x_1$을 수치 탐색(Brent 방법)한다:
     $$x_{1, \text{med}} \approx 2.804$$

2. **$x_2$의 주변분포:**
   - **평균 $\mathbb{E}[x_2]$:** 정리 6.12에 의해:
     $$\mathbb{E}[x_2] = 0.4 \times 2 + 0.6 \times 0 = 0.800$$
   - **최빈값 (Mode):** 1차 도함수 $p'(x_2) = 0$인 임계점을 수치 해석으로 탐색한다:
     $$p'(x_2) = 0.4 \left(-\frac{x_2 - 2}{1}\right)\mathcal{N}(x_2 \mid 2, 1) + 0.6 \left(-\frac{x_2}{1.7}\right)\mathcal{N}(x_2 \mid 0, 1.7) = 0$$
     두 성분의 평균 간격($2 - 0 = 2$)이 표준편차들에 비해 크지 않아 두 봉우리가 하나로 합쳐진 **단봉분포(unimodal)**\ 를 형성한다.  
     방정식의 유일한 해는 다음과 같다:
     $$x_2 \approx 1.331 \quad (\text{밀도 } p(1.331) \approx 0.237) \rightarrow \textbf{전역 최빈값}$$
   - **중앙값 (Median):** 누적분포함수 $F(x_2) = 0.4 \Phi\left(\frac{x_2 - 2}{1}\right) + 0.6 \Phi\left(\frac{x_2}{\sqrt{1.7}}\right) = 0.5$를 만족하는 해:
     $$x_{2, \text{med}} \approx 0.869$$

**(c) 2차원 결합분포의 평균과 최빈값 계산**

1. **2차원 결합 평균벡터 $\mathbb{E}[\mathbf{x}]$:** 기댓값의 선형성에 의해:
   $$\mathbb{E}[\mathbf{x}] = 0.4 \begin{bmatrix} 10 \\ 2 \end{bmatrix} + 0.6 \begin{bmatrix} 0 \\ 0 \end{bmatrix} = \begin{bmatrix} 4.000 \\ 0.800 \end{bmatrix}$$
2. **2차원 최빈값 (Mode):** 2차원 확률밀도함수 $p(\mathbf{x})$를 최대화하는 $\mathbf{x} = [x_1, x_2]^\top$를 2차원 수치 최적화(Nelder-Mead 및 BFGS)로 탐색한다.
   - 성분 1의 중심 $\mathbf{x}_1 = [10, 2]^\top$ 부근: 밀도 피크 $p(\mathbf{x}) \approx \frac{0.4}{2\pi \sqrt{1}} \approx 0.0637$
   - 성분 2의 중심 $\mathbf{x}_2 = [0, 0]^\top$ 부근: 행렬식 $|\boldsymbol{\Sigma}_2| = 8.4 \times 1.7 - 2.0^2 = 14.28 - 4.0 = 10.28$이므로 밀도 피크 $p(\mathbf{x}) \approx \frac{0.6}{2\pi \sqrt{10.28}} \approx 0.0298$
   두 중심 사이 거리가 $\sqrt{10^2 + 2^2} \approx 10.2$로 매우 멀어 상호 간섭이 거의 없으며, 두 개의 극댓값이 존재한다:
   - **전역 최빈값(Global mode):** $\mathbf{x}^* \approx \begin{bmatrix} 9.999 \\ 2.000 \end{bmatrix} \quad (\text{밀도 } p \approx 0.0637)$
   - **국소 최빈값(Local mode):** $\mathbf{x}_{\text{local}} \approx \begin{bmatrix} 0.000 \\ 0.000 \end{bmatrix} \quad (\text{밀도 } p \approx 0.0298)$

**답:**
- **(a) 각 차원 주변분포:**  
  $$p(x_1) = 0.4 \mathcal{N}(x_1 \mid 10, 1) + 0.6 \mathcal{N}(x_1 \mid 0, 8.4)$$  
  $$p(x_2) = 0.4 \mathcal{N}(x_2 \mid 2, 1) + 0.6 \mathcal{N}(x_2 \mid 0, 1.7)$$
- **(b) 각 주변분포의 대푯값 (소수 셋째 자리):**  
  - $x_1$: **평균 = $4.000$**, **전역 최빈값 = $9.998$** (국소 최빈값 $0.000$), **중앙값 = $2.804$**  
  - $x_2$: **평균 = $0.800$**, **최빈값 = $1.331$** (단봉), **중앙값 = $0.869$**  
- **(c) 2차원 결합분포 대푯값:**  
  - **평균 = $\begin{bmatrix} 4.000 \\ 0.800 \end{bmatrix}$**  
  - **전역 최빈값 = $\begin{bmatrix} 9.999 \\ 2.000 \end{bmatrix}$** (국소 최빈값 $\begin{bmatrix} 0.000 \\ 0.000 \end{bmatrix}$)

**확인:**  
Python `scipy.optimize` (Brentq, Nelder-Mead, BFGS)로 도함수 근 및 목적함수 최적화를 수행하여 전역/국소 최빈값 및 중앙값을 정밀 검산 완료함.

---

### 6.3 베르누이 우도의 켤레 사전분포와 사후분포

**문제:**  
컴파일러의 작동 여부 $x \in \{0, 1\}$를 모수 $\mu$인 베르누이 분포 $p(x \mid \mu) = \mu^x (1 - \mu)^{1-x}$로 모델링한다. 베르누이 우도에 대한 켤레 사전분포(conjugate prior)를 선택하고, $N$개의 독립 표본 $x_1, \dots, x_N$이 주어졌을 때 모수의 사후분포 $p(\mu \mid x_1, \dots, x_N)$를 구하라.

**풀이:**

1. **표본 데이터에 대한 결합 우도함수 구성:**  
   데이터셋 $\mathcal{D} = \{x_1, \dots, x_N\}$의 i.i.d. 가정에 따라 결합 우도는 각 확률의 곱이다:
   $$\begin{aligned} p(\mathcal{D} \mid \mu) &= \prod_{n=1}^N \mu^{x_n} (1 - \mu)^{1 - x_n} \\ &= \mu^{\sum_{n=1}^N x_n} (1 - \mu)^{N - \sum_{n=1}^N x_n} \end{aligned}$$
   성공 횟수를 $m = \sum_{n=1}^N x_n$이라 두면, 우도는 $\mu^m (1 - \mu)^{N - m}$ 꼴이다.

2. **켤레 사전분포(Conjugate Prior)의 선택:**  
   켤레성이란 사전분포와 사후분포가 동일한 함수 형태의 분포군에 속하는 성질을 의미한다(교재 6.6.1절).  
   우도함수가 $\mu^a (1-\mu)^b$ 꼴의 거듭제곱 형태이므로, 사전분포 역시 동일한 함수형을 지닌 **베타 분포(Beta distribution, 교재 6.6절 식 (6.98))**\ 를 선택한다:
   $$\begin{aligned} &p(\mu \mid \alpha, \beta) = \text{Beta}(\mu \mid \alpha, \beta) \\ &\quad = \frac{1}{\text{B}(\alpha, \beta)} \mu^{\alpha - 1} (1 - \mu)^{\beta - 1} \end{aligned}$$
   여기서 $\alpha > 0, \beta > 0$는 초모수(hyperparameter)이며, $\text{B}(\alpha, \beta) = \frac{\Gamma(\alpha)\Gamma(\beta)}{\Gamma(\alpha+\beta)}$는 정규화 상수이다.

3. **베이즈 정리를 통한 사후분포 유도:**  
   사후분포는 베이즈 정리(교재 식 (6.23))에 의해 우도와 사전분포의 곱에 비례한다:
   $$p(\mu \mid \mathcal{D}) \propto p(\mathcal{D} \mid \mu) p(\mu \mid \alpha, \beta)$$
4. $\mu$에 관한 항들을 대입하여 지수법칙으로 묶는다:
   $$\begin{aligned} &p(\mu \mid \mathcal{D}) \propto \bigl[ \mu^m (1 - \mu)^{N - m} \bigr] \times \bigl[ \mu^{\alpha - 1} \\ &\quad (1 - \mu)^{\beta - 1} \bigr] \\ &\quad = \mu^{(\alpha + m) - 1} (1 - \mu)^{(\beta + N - m) - 1} \end{aligned}$$
5. 이는 모수가 $\alpha' = \alpha + m$, $\beta' = \beta + N - m$인 새로운 베타 분포의 핵(kernel)과 일치한다.
6. 베타 분포의 정규화 상수를 곱하여 완전한 확률밀도함수를 작성한다:
   $$\begin{aligned} &p(\mu \mid x_1, \dots, x_N) \\ &\quad = \frac{1}{\text{B}(\alpha + m, \beta + N - m)} \mu^{\alpha + m - 1} \\ &\quad (1 - \mu)^{\beta + N - m - 1} \end{aligned}$$

**답:**
- **켤레 사전분포:**  
  $$\begin{aligned} p(\mu) &= \text{Beta}(\alpha, \beta) \\ &= \frac{1}{\text{B}(\alpha, \beta)} \mu^{\alpha - 1} (1 - \mu)^{\beta - 1} \end{aligned}$$
- **사후분포:**  

  $$\begin{aligned} &p(\mu \mid x_1, \dots, x_N) \\ &\quad = \text{Beta}\biggl( \alpha + \sum_{n=1}^N x_n, \\ &\quad \; \beta + N - \sum_{n=1}^N x_n \biggr) \end{aligned}$$

  $$= \frac{1}{\text{B}\left(\alpha + \sum_{n=1}^N x_n, \; \beta + N - \sum_{n=1}^N x_n\right)} \mu^{\alpha + \sum_{n=1}^N x_n - 1} (1 - \mu)^{\beta + N - \sum_{n=1}^N x_n - 1}$$

**확인:**  
초모수 $\alpha$와 $\beta$는 사전 가상 관측치(pseudo-counts)로 해석된다. 데이터에서 성공 횟수 $\sum x_n$과 실패 횟수 $N - \sum x_n$이 각각 가산되어 자연스럽게 갱신되는 켤레성의 기본 직관과 정확히 부합함.

---

### 6.4 베이즈 정리를 이용한 주머니 선택 사후확률

**문제:**  
가방 1에는 망고 4개와 사과 2개가 들어 있고, 가방 2에는 망고 4개와 사과 4개가 들어 있다. 앞면이 나올 확률이 0.6인 비대칭 동전을 던져 앞면이면 가방 1에서 과일 하나를 무작위로 꺼내고, 뒷면이면 가방 2에서 꺼낸다. 꺼낸 과일이 망고였을 때, 그 망고가 가방 2에서 나왔을 확률을 구하라.

**풀이:**

1. **사건 정의 및 사전확률 정리:**  
   - $B_1$: 가방 1을 선택하는 사건 (동전 앞면) $\implies P(B_1) = 0.6$
   - $B_2$: 가방 2를 선택하는 사건 (동전 뒷면) $\implies P(B_2) = 1 - 0.6 = 0.4$
   - $M$: 꺼낸 과일이 망고인 사건

2. **각 가방별 우도(조건부 확률) 계산:**  
   - 가방 1의 총 과일 수는 $4 + 2 = 6$개:
     $$P(M \mid B_1) = \frac{4}{6} = \frac{2}{3}$$
   - 가방 2의 총 과일 수는 $4 + 4 = 8$개:
     $$P(M \mid B_2) = \frac{4}{8} = \frac{1}{2}$$

3. **전확률 공식(Total Probability Theorem, 합의 법칙)을 통한 망고 추출의 주변확률 계산:**  
   교재 식 (6.20)(합의 법칙)과 (6.22)(곱의 법칙)에 따라:
   $$\begin{aligned} P(M) &= P(M \mid B_1) P(B_1) \\ &\quad + P(M \mid B_2) P(B_2) \end{aligned}$$
   수치를 대입한다:
   $$\begin{aligned} P(M) &= \left(\frac{2}{3}\right) \times 0.6 + \left(\frac{1}{2}\right) \times 0.4 \\ &= 0.4 + 0.2 = 0.6 \end{aligned}$$

4. **베이즈 정리(Bayes' Theorem, 교재 식 (6.23)) 적용:**  
   망고가 관측되었을 때 가방 2에서 나왔을 사후확률은:
   $$P(B_2 \mid M) = \frac{P(M \mid B_2) P(B_2)}{P(M)}$$
   분자와 분모에 값을 대입한다:
   $$P(B_2 \mid M) = \frac{0.2}{0.6} = \frac{1}{3} \approx 0.3333$$

**답:**  

$$P(B_2 \mid M) = \frac{1}{3} \approx 0.333 \quad (33.33\%)$$

**확인:**  
Python 수치 검산 완료: 분자 $0.5 \times 0.4 = 0.2$, 분모 $(4/6)\times 0.6 + (4/8)\times 0.4 = 0.4 + 0.2 = 0.6$, 비 $\frac{0.2}{0.6} = \frac{1}{3}$.  
직관적 확인: 가방 1에서 나오는 망고의 가중 빈도는 $0.6 \times (4/6) = 0.4$, 가방 2에서 나오는 망고의 가중 빈도는 $0.4 \times (4/8) = 0.2$이므로 전체 망고 중 가방 2의 비율은 정확히 $\frac{0.2}{0.4 + 0.2} = \frac{1}{3}$이다.

---

### 6.5 선형 동적계와 칼만 필터 예측·갱신

**문제:**  
다음 이산시간 선형 시계열 시스템을 고려하라:
$$\mathbf{x}_{t+1} = \mathbf{A}\mathbf{x}_t + \mathbf{w}, \quad \mathbf{w} \sim \mathcal{N}(\mathbf{0}, \mathbf{Q})$$
$$\mathbf{y}_t = \mathbf{C}\mathbf{x}_t + \mathbf{v}, \quad \mathbf{v} \sim \mathcal{N}(\mathbf{0}, \mathbf{R})$$
여기서 $\mathbf{w}, \mathbf{v}$는 i.i.d. 가우시안 노이즈이며, 초기 상태는 $p(\mathbf{x}_0) = \mathcal{N}(\boldsymbol{\mu}_0, \boldsymbol{\Sigma}_0)$이다.  
(a) 결합분포 $p(\mathbf{x}_0, \mathbf{x}_1, \dots, \mathbf{x}_T)$의 형태는 무엇인가? 그 이유를 명시적 계산 없이 정당화하라.  
(b) $p(\mathbf{x}_t \mid \mathbf{y}_1, \dots, \mathbf{y}_t) = \mathcal{N}(\boldsymbol{\mu}_t, \boldsymbol{\Sigma}_t)$라 가정할 때,  
1. $p(\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t})$를 구하라.  
2. $p(\mathbf{x}_{t+1}, \mathbf{y}_{t+1} \mid \mathbf{y}_{1:t})$를 구하라.  
3. 시점 $t+1$에서 측정값 $\mathbf{y}_{t+1} = \hat{\mathbf{y}}$를 관측한 후 사후분포 $p(\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t+1})$를 구하라.

**풀이:**

**(a) 결합분포 $p(\mathbf{x}_0, \mathbf{x}_1, \dots, \mathbf{x}_T)$의 형태와 정당화**
- **형태:** 결합분포 $p(\mathbf{x}_0, \mathbf{x}_1, \dots, \mathbf{x}_T)$는 **다변량 가우시안 분포(Multivariate Gaussian Distribution)**\ 이다.
- **정당화:**  
  1. 마르코프 성질과 확률의 곱의 법칙에 의해 결합분포는 $p(\mathbf{x}_0, \dots, \mathbf{x}_T) = p(\mathbf{x}_0) \prod_{t=0}^{T-1} p(\mathbf{x}_{t+1} \mid \mathbf{x}_t)$로 표현된다.
  2. 시스템 동역학 식을 재귀적으로 전개하면, 각 상태벡터 $\mathbf{x}_t$는 초기 상태 $\mathbf{x}_0$와 독립 노이즈 벡터들 $\mathbf{w}_0, \dots, \mathbf{w}_{t-1}$의 선형 결합으로 표현된다:
     $$\mathbf{x}_t = \mathbf{A}^t \mathbf{x}_0 + \sum_{i=0}^{t-1} \mathbf{A}^{t-1-i} \mathbf{w}_i$$
  3. 초기 상태 $\mathbf{x}_0$와 노이즈 벡터 $\mathbf{w}_i$들이 모두 상호 독립인 가우시안 확률벡터이므로, 이들을 쌓은 벡터 $[\mathbf{x}_0^\top, \mathbf{w}_0^\top, \dots, \mathbf{w}_{T-1}^\top]^\top$는 결합 가우시안 분포를 따른다.
  4. 상태 벡터들의 전체 시퀀스 $[\mathbf{x}_0^\top, \mathbf{x}_1^\top, \dots, \mathbf{x}_T^\top]^\top$는 이 결합 가우시안 벡터의 선형 변환(linear transformation)이다.
  5. 가우시안 분포의 선형 변환 성질(교재 6.5.3절)에 의해 가우시안 벡터의 임의의 선형 변환은 다시 가우시안 분포를 따르므로, 전체 시퀀스의 결합분포는 결합 가우시안 분포가 된다.

**(b-1) 상태 예측(Time Update / State Prediction): $p(\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t})$**
$\mathbf{x}_{t+1} = \mathbf{A}\mathbf{x}_t + \mathbf{w}$이고 $\mathbf{w} \sim \mathcal{N}(\mathbf{0}, \mathbf{Q})$는 과거 관측 및 현재 상태와 독립이다.
1. 기댓값의 선형성에 의한 예측 평균:
   $$\boldsymbol{\mu}_{t+1 \mid t} = \mathbb{E}[\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t}] = \mathbb{E}[\mathbf{A}\mathbf{x}_t + \mathbf{w} \mid \mathbf{y}_{1:t}] = \mathbf{A}\mathbb{E}[\mathbf{x}_t \mid \mathbf{y}_{1:t}] + \mathbb{E}[\mathbf{w}] = \mathbf{A}\boldsymbol{\mu}_t$$
2. 선형 변환의 공분산 공식(교재 식 (6.51))과 독립인 두 변수 합의 분산 공식(식 (6.48)에서 교차공분산이 0)에 의한 예측 공분산:
   $$\boldsymbol{\Sigma}_{t+1 \mid t} = \mathbb{V}[\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t}] = \mathbb{V}[\mathbf{A}\mathbf{x}_t \mid \mathbf{y}_{1:t}] + \mathbb{V}[\mathbf{w}] = \mathbf{A}\boldsymbol{\Sigma}_t\mathbf{A}^\top + \mathbf{Q}$$
3. 따라서 예측 분포:
   $$p(\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t}) = \mathcal{N}(\mathbf{x}_{t+1} \mid \boldsymbol{\mu}_{t+1 \mid t}, \boldsymbol{\Sigma}_{t+1 \mid t}) = \mathcal{N}(\mathbf{A}\boldsymbol{\mu}_t, \; \mathbf{A}\boldsymbol{\Sigma}_t\mathbf{A}^\top + \mathbf{Q})$$

**(b-2) 상태와 측정값의 결합분포: $p(\mathbf{x}_{t+1}, \mathbf{y}_{t+1} \mid \mathbf{y}_{1:t})$**
측정 방정식은 $\mathbf{y}_{t+1} = \mathbf{C}\mathbf{x}_{t+1} + \mathbf{v}_{t+1}$이며 $\mathbf{v}_{t+1} \sim \mathcal{N}(\mathbf{0}, \mathbf{R})$이다.
1. 측정값 $\mathbf{y}_{t+1}$의 조건부 평균:
   $$\begin{aligned} &\mathbb{E}[\mathbf{y}_{t+1} \mid \mathbf{y}_{1:t}] \\ &\quad = \mathbf{C}\mathbb{E}[\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t}] + \mathbb{E}[\mathbf{v}_{t+1}] \\ &\quad = \mathbf{C}\boldsymbol{\mu}_{t+1 \mid t} = \mathbf{C}\mathbf{A}\boldsymbol{\mu}_t \end{aligned}$$
2. 측정값 $\mathbf{y}_{t+1}$의 조건부 공분산:
   $$\begin{aligned} &\mathbb{V}[\mathbf{y}_{t+1} \mid \mathbf{y}_{1:t}] \\ &\quad = \mathbf{C}\mathbb{V}[\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t}]\mathbf{C}^\top + \mathbb{V}[\mathbf{v}_{t+1}] \\ &\quad = \mathbf{C}\boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top + \mathbf{R} \end{aligned}$$
3. 상태 $\mathbf{x}_{t+1}$과 측정값 $\mathbf{y}_{t+1}$의 교차공분산(cross-covariance):
   $$\begin{aligned} &\text{Cov}[\mathbf{x}_{t+1}, \mathbf{y}_{t+1} \mid \mathbf{y}_{1:t}] \\ &\quad = \mathbb{E}[(\mathbf{x}_{t+1} - \boldsymbol{\mu}_{t+1 \mid t}) \\ &\quad (\mathbf{C}(\mathbf{x}_{t+1} - \boldsymbol{\mu}_{t+1 \mid t}) + \mathbf{v}_{t+1})^\top \mid \mathbf{y}_{1:t}] \end{aligned}$$
   $$\begin{aligned} &\quad = \mathbb{E}[(\mathbf{x}_{t+1} - \boldsymbol{\mu}_{t+1 \mid t}) \\ &\quad (\mathbf{x}_{t+1} - \boldsymbol{\mu}_{t+1 \mid t})^\top \mid \mathbf{y}_{1:t}] \mathbf{C}^\top + \mathbf{0} \\ &\quad = \boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top \end{aligned}$$
4. 대칭성에 의해 $\text{Cov}[\mathbf{y}_{t+1}, \mathbf{x}_{t+1} \mid \mathbf{y}_{1:t}] = \mathbf{C}\boldsymbol{\Sigma}_{t+1 \mid t}$.
5. 따라서 결합분포:

   $$\begin{aligned} &\begin{bmatrix} \mathbf{x}_{t+1} \\ \mathbf{y}_{t+1} \end{bmatrix} \;\Bigg|\; \mathbf{y}_{1:t} \sim \mathcal{N}\left( \begin{bmatrix} \boldsymbol{\mu}_{t+1 \mid t} \\ \mathbf{C}\boldsymbol{\mu}_{t+1 \mid t} \end{bmatrix}, \right. \\ &\qquad \left. \begin{bmatrix} \boldsymbol{\Sigma}_{t+1 \mid t} & \boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top \\ \mathbf{C}\boldsymbol{\Sigma}_{t+1 \mid t} & \mathbf{C}\boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top + \mathbf{R} \end{bmatrix} \right) \end{aligned}$$

**(b-3) 측정 갱신(Measurement Update): $p(\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t+1})$**
새로운 관측값 $\mathbf{y}_{t+1} = \hat{\mathbf{y}}$가 주어졌을 때 조건부 가우시안 공식(교재 6.5.1절 식 (6.65)~(6.67))을 결합분포에 적용한다.
1. 칼만 이득 행렬(Kalman Gain) $\mathbf{K}_{t+1}$ 정의:
   $$\mathbf{K}_{t+1} = \text{Cov}[\mathbf{x}_{t+1}, \mathbf{y}_{t+1}]\left(\mathbb{V}[\mathbf{y}_{t+1}]\right)^{-1} = \boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top \left( \mathbf{C}\boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top + \mathbf{R} \right)^{-1}$$
2. 사후 평균 벡터 갱신:
   $$\boldsymbol{\mu}_{t+1} = \boldsymbol{\mu}_{t+1 \mid t} + \mathbf{K}_{t+1} \left( \hat{\mathbf{y}} - \mathbf{C}\boldsymbol{\mu}_{t+1 \mid t} \right)$$
3. 사후 공분산 행렬 갱신:
   $$\boldsymbol{\Sigma}_{t+1} = \boldsymbol{\Sigma}_{t+1 \mid t} - \mathbf{K}_{t+1} \mathbf{C} \boldsymbol{\Sigma}_{t+1 \mid t} = (\mathbf{I} - \mathbf{K}_{t+1}\mathbf{C})\boldsymbol{\Sigma}_{t+1 \mid t}$$
4. 따라서 갱신된 사후분포:
   $$p(\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t+1}) = \mathcal{N}(\mathbf{x}_{t+1} \mid \boldsymbol{\mu}_{t+1}, \boldsymbol{\Sigma}_{t+1})$$

**답:**
- **(a)** **다변량 가우시안 분포(Multivariate Gaussian)**. (이유: 초기 가우시안 상태와 독립 가우시안 노이즈들의 선형 동역학 결합이기 때문)
- **(b-1)**

  $$\begin{aligned} &p(\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t}) \\ &\quad = \mathcal{N}(\mathbf{A}\boldsymbol{\mu}_t, \; \mathbf{A}\boldsymbol{\Sigma}_t\mathbf{A}^\top + \mathbf{Q}) \end{aligned}$$

- **(b-2)**

  $$\begin{aligned} &\begin{bmatrix} \mathbf{x}_{t+1} \\ \mathbf{y}_{t+1} \end{bmatrix} \;\Bigg|\; \mathbf{y}_{1:t} \sim \mathcal{N}\left( \begin{bmatrix} \mathbf{A}\boldsymbol{\mu}_t \\ \mathbf{C}\mathbf{A}\boldsymbol{\mu}_t \end{bmatrix}, \right. \\ &\qquad \left. \begin{bmatrix} \boldsymbol{\Sigma}_{t+1 \mid t} & \boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top \\ \mathbf{C}\boldsymbol{\Sigma}_{t+1 \mid t} & \mathbf{C}\boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top + \mathbf{R} \end{bmatrix} \right) \end{aligned}$$

  (단, $\boldsymbol{\Sigma}_{t+1 \mid t} = \mathbf{A}\boldsymbol{\Sigma}_t\mathbf{A}^\top + \mathbf{Q}$)
- **(b-3)**

  $$p(\mathbf{x}_{t+1} \mid \mathbf{y}_{1:t+1}) = \mathcal{N}(\boldsymbol{\mu}_{t+1}, \boldsymbol{\Sigma}_{t+1})$$

  $$\begin{aligned} &\mathbf{K}_{t+1} \\ &\quad = \boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top (\mathbf{C}\boldsymbol{\Sigma}_{t+1 \mid t}\mathbf{C}^\top + \mathbf{R})^{-1} \end{aligned}$$  
  $$\boldsymbol{\mu}_{t+1} = \mathbf{A}\boldsymbol{\mu}_t + \mathbf{K}_{t+1}(\hat{\mathbf{y}} - \mathbf{C}\mathbf{A}\boldsymbol{\mu}_t)$$  
  $$\boldsymbol{\Sigma}_{t+1} = (\mathbf{I} - \mathbf{K}_{t+1}\mathbf{C})\boldsymbol{\Sigma}_{t+1 \mid t}$$

---

### 6.6 분산 정의와 원점수 공식의 등가성 증명

**문제:**  
교재 식 (6.43)의 표준 분산 정의 $\mathbb{V}_X[x] := \mathbb{E}_X[(x - \mu)^2]$로부터, 원점수 분산 공식(raw-score formula)인 식 (6.44) $\mathbb{V}_X[x] = \mathbb{E}_X[x^2] - (\mathbb{E}_X[x])^2$를 유도하라.

**풀이:**

1. **분산의 표준 정의(교재 식 (6.43)):**  
   평균을 $\mu := \mathbb{E}_X[x]$라 할 때,
   $$\mathbb{V}_X[x] = \mathbb{E}_X\left[(x - \mu)^2\right]$$
2. **기댓값 내부의 완전제곱식 전개:**  
   $$(x - \mu)^2 = x^2 - 2\mu x + \mu^2$$
3. **기댓값의 선형성(교재 정의 6.3 뒤의 설명) 적용:**  
   합과 스칼라 곱에 대해 기댓값 연산자를 분배한다:
   $$\mathbb{E}_X\left[(x - \mu)^2\right] = \mathbb{E}_X\left[x^2 - 2\mu x + \mu^2\right] = \mathbb{E}_X[x^2] - \mathbb{E}_X[2\mu x] + \mathbb{E}_X[\mu^2]$$
4. **상수 성질 적용:**  
   $\mu$는 확정된 상수(스칼라)이므로 $\mathbb{E}_X[2\mu x] = 2\mu \mathbb{E}_X[x]$이고, 상수의 기댓값은 자기 자신이므로 $\mathbb{E}_X[\mu^2] = \mu^2$이다:
   $$= \mathbb{E}_X[x^2] - 2\mu \mathbb{E}_X[x] + \mu^2$$
5. **$\mu = \mathbb{E}_X[x]$ 치환 및 동류항 정리:**  
   $$= \mathbb{E}_X[x^2] - 2(\mathbb{E}_X[x])(\mathbb{E}_X[x]) + (\mathbb{E}_X[x])^2$$
   $$= \mathbb{E}_X[x^2] - 2(\mathbb{E}_X[x])^2 + (\mathbb{E}_X[x])^2$$
   $$= \mathbb{E}_X[x^2] - (\mathbb{E}_X[x])^2$$
   이로써 식 (6.44)가 완전히 증명되었다.

**답:**  

$$\begin{aligned} &\mathbb{V}_X[x] = \mathbb{E}_X[(x - \mu)^2] \\ &\quad = \mathbb{E}_X[x^2] - 2\mu\mathbb{E}[x] + \mu^2 \\ &\quad = \mathbb{E}_X[x^2] - (\mathbb{E}_X[x])^2\quad \text{(증명 완료)} \end{aligned}$$

---

### 6.7 데이터 쌍간 차이와 표본분산의 관계 증명

**문제:**  
데이터셋 표본 $x_1, \dots, x_N$에 대해 모든 쌍의 제곱 차이의 평균과 원점수 표본분산 공식 사이의 관계식인 식 (6.45)를 증명하라:
$$\begin{aligned} &\frac{1}{N^2} \sum_{i=1}^N \sum_{j=1}^N (x_i - x_j)^2 \\ &\quad = 2 \left[ \frac{1}{N}\sum_{i=1}^N x_i^2 - \left( \frac{1}{N}\sum_{i=1}^N x_i \right)^2 \right] \end{aligned}$$

**풀이:**

1. **좌변의 제곱항 전개:**  
   $(x_i - x_j)^2 = x_i^2 - 2x_i x_j + x_j^2$ 이므로:
   $$\sum_{i=1}^N \sum_{j=1}^N (x_i - x_j)^2 = \sum_{i=1}^N \sum_{j=1}^N \left( x_i^2 - 2x_i x_j + x_j^2 \right)$$
2. **이중합 기호를 각 항으로 분배:**  
   $$= \sum_{i=1}^N \sum_{j=1}^N x_i^2 - 2 \sum_{i=1}^N \sum_{j=1}^N x_i x_j + \sum_{i=1}^N \sum_{j=1}^N x_j^2$$
3. **각 항의 합산 계산:**  
   - **첫 번째 항:** $j$에 무관하므로 $j$에 대해 $N$번 더해진다:
     $$\sum_{j=1}^N \sum_{i=1}^N x_i^2 = N \sum_{i=1}^N x_i^2$$
   - **세 번째 항:** $i$에 무관하므로 $i$에 대해 $N$번 더해지며, 인덱스만 다를 뿐 동일한 합이다:
     $$\sum_{i=1}^N \sum_{j=1}^N x_j^2 = N \sum_{j=1}^N x_j^2 = N \sum_{i=1}^N x_i^2$$
   - **두 번째 항:** $x_i$와 $x_j$의 합이 서로 분리된다:
     $$\sum_{i=1}^N \sum_{j=1}^N x_i x_j = \left( \sum_{i=1}^N x_i \right) \left( \sum_{j=1}^N x_j \right) = \left( \sum_{i=1}^N x_i \right)^2$$
4. **합산 결과 결합:**  
   $$\sum_{i=1}^N \sum_{j=1}^N (x_i - x_j)^2 = N \sum_{i=1}^N x_i^2 - 2 \left( \sum_{i=1}^N x_i \right)^2 + N \sum_{i=1}^N x_i^2 = 2N \sum_{i=1}^N x_i^2 - 2 \left( \sum_{i=1}^N x_i \right)^2$$
5. **양변을 $N^2$으로 나누기:**  
   $$\frac{1}{N^2} \sum_{i=1}^N \sum_{j=1}^N (x_i - x_j)^2 = \frac{2N}{N^2} \sum_{i=1}^N x_i^2 - \frac{2}{N^2} \left( \sum_{i=1}^N x_i \right)^2$$
6. **공통인수 2를 묶고 정리:**  
   $$= 2 \left[ \frac{1}{N} \sum_{i=1}^N x_i^2 - \left( \frac{1}{N} \sum_{i=1}^N x_i \right)^2 \right]$$
   이로써 교재 식 (6.45)가 증명되었다.

**답:**  

$$\begin{aligned} &\frac{1}{N^2} \sum_{i=1}^N \sum_{j=1}^N (x_i - x_j)^2 \\ &\quad = \frac{2}{N}\sum_{i=1}^N x_i^2 - 2\left(\frac{1}{N}\sum_{i=1}^N x_i\right)^2 \\ &\quad = 2 \left[ \frac{1}{N}\sum_{i=1}^N x_i^2 - \left( \frac{1}{N}\sum_{i=1}^N x_i \right)^2 \right] \\ &\text{(증명 완료)} \end{aligned}$$

**확인:**  
괄호 안의 식은 데이터의 표본분산 $\hat{\sigma}^2$이므로, 모든 점 쌍 사이의 평균 제곱 거리는 분산의 정확히 2배($2\mathbb{V}[X]$)가 된다. $X_1, X_2$가 i.i.d.일 때 $\mathbb{E}[(X_1 - X_2)^2] = \mathbb{V}[X_1 - X_2] = \mathbb{V}[X_1] + \mathbb{V}[X_2] = 2\mathbb{V}[X]$라는 이론적 관계와 완벽히 일치함.

---

### 6.8 베르누이 분포의 지수족 자연모수 형태 표현

**문제:**  
베르누이 분포 $p(x \mid \mu) = \mu^x (1 - \mu)^{1-x}$ ($x \in \{0, 1\}$)를 교재 식 (6.107)의 지수족 자연모수(natural parameter) 표준형으로 표현하라:
$$p(x \mid \theta) = h(x) \exp\left( \langle \theta, \phi(x) \rangle - A(\theta) \right)$$

**풀이:**

교재 예제 6.14(212쪽)와 같은 계산이다.

1. **베르누이 PMF를 지수함수 형태로 변환:**  
   지수함수와 로그함수의 역관계 $a = \exp(\ln a)$를 이용한다:
   $$\begin{aligned} p(x \mid \mu) &= \mu^x (1 - \mu)^{1-x} \\ &= \exp\left( \ln\left( \mu^x (1 - \mu)^{1-x} \right) \right) \end{aligned}$$
2. **로그 성질을 이용하여 지수를 덧셈 형태로 분해:**  
   $$= \exp\left( x \ln \mu + (1 - x) \ln(1 - \mu) \right)$$
3. **$x$에 관한 항과 상수항으로 정리:**  

   $$\begin{aligned} &= \exp\bigl( x \ln \mu - x \ln(1 - \mu) \\ &\quad + \ln(1 - \mu) \bigr) \\ &\quad = \exp\biggl( x \ln\left(\frac{\mu}{1 - \mu}\right) \\ &\quad + \ln(1 - \mu) \biggr) \end{aligned}$$

4. **지수족 표준형과 각 구성요소 매칭:**  
   지수족 표준형 $\exp(\theta \phi(x) - A(\theta))$와 대조한다:
   - **충분통계량 (Sufficient Statistic):** $\phi(x) = x$
   - **자연모수 (Natural Parameter):** $\theta = \ln\left(\frac{\mu}{1 - \mu}\right)$ (로짓 함수, log-odds)
   - **기저 측도 (Base Measure):** $h(x) = 1$ ($x \in \{0, 1\}$)
   - **로그 정규화 분할함수 (Log-partition Function):** $-A(\theta) = \ln(1 - \mu) \implies A(\theta) = -\ln(1 - \mu)$
5. **$A(\theta)$를 자연모수 $\theta$의 함수로 표현:**  
   $\theta = \ln\left(\frac{\mu}{1 - \mu}\right) \implies e^\theta = \frac{\mu}{1 - \mu} \implies \mu = \frac{e^\theta}{1 + e^\theta}$ (시그모이드 함수).  
   따라서 $1 - \mu = 1 - \frac{e^\theta}{1 + e^\theta} = \frac{1}{1 + e^\theta}$ 이다.
   $$A(\theta) = -\ln\left(\frac{1}{1 + e^\theta}\right) = \ln(1 + e^\theta)$$
6. **최종 지수족 형태 합성:**  
   $$p(x \mid \theta) = 1 \cdot \exp\left( \theta x - \ln(1 + e^\theta) \right)$$

**답:**  
- **자연모수:** $\theta = \ln\left(\frac{\mu}{1 - \mu}\right)$  
- **충분통계량:** $\phi(x) = x$  
- **기저 측도:** $h(x) = 1$  
- **로그 분할함수:** $A(\theta) = \ln(1 + e^\theta)$  
- **표준형 표현:**  
  $$\mathbf{p(x \mid \theta) = \exp\left( \theta x - \ln(1 + e^\theta) \right)}$$

**확인:**  
(교재 밖 보충) 지수족에서는 로그 분할함수의 1차 미분이 충분통계량의 기댓값이다:  
$\nabla_\theta A(\theta) = \frac{d}{d\theta}\ln(1 + e^\theta) = \frac{e^\theta}{1 + e^\theta} = \mu = \mathbb{E}[x]$. 정확히 성립함.

---

### 6.9 이항분포와 베타분포의 지수족 표현 및 곱의 지수족 성질

**문제:**  
(a) 이항분포(Binomial distribution)를 지수족 형태로 표현하라.  
(b) 베타분포(Beta distribution)를 지수족 형태로 표현하라.  
(c) 베타분포와 이항분포의 곱 역시 지수족에 속함을 보여라.

**풀이:**

**(a) 이항분포의 지수족 표현**
1. 이항분포의 확률질량함수: $p(x \mid \mu, N) = \binom{N}{x} \mu^x (1 - \mu)^{N - x}$ ($x \in \{0, 1, \dots, N\}$).
2. 로그와 지수를 취해 변형:

   $$\begin{aligned} &p(x \mid \mu, N) = \binom{N}{x} \exp\bigl( x \ln \mu \\ &\quad + (N - x) \ln(1 - \mu) \bigr) \\ &\quad = \binom{N}{x} \exp\biggl( x \ln\left(\frac{\mu}{1 - \mu}\right) \\ &\quad + N \ln(1 - \mu) \biggr) \end{aligned}$$

3. 지수족 성분 대조:
   - 기저 측도: $h(x) = \binom{N}{x}$
   - 자연모수: $\theta = \ln\left(\frac{\mu}{1 - \mu}\right)$
   - 충분통계량: $\phi(x) = x$
   - 로그 분할함수: $1 - \mu = \frac{1}{1 + e^\theta}$ 이므로 $A(\theta) = -N \ln(1 - \mu) = N \ln(1 + e^\theta)$
4. 지수족 표현:
   $$\begin{aligned} &p(x \mid \theta) \\ &\quad = \binom{N}{x} \exp\left( \theta x - N \ln(1 + e^\theta) \right) \end{aligned}$$

**(b) 베타분포의 지수족 표현**
1. 모수 $\mu \in (0, 1)$에 대한 베타분포의 확률밀도함수(초모수 $\alpha, \beta$):
   $$p(\mu \mid \alpha, \beta) = \frac{1}{\text{B}(\alpha, \beta)} \mu^{\alpha - 1} (1 - \mu)^{\beta - 1}$$
2. 지수 형태로 변환:

   $$\begin{aligned} &p(\mu \mid \alpha, \beta) = \exp\bigl( (\alpha - 1)\ln \mu \\ &\quad + (\beta - 1)\ln(1 - \mu) - \ln\text{B}(\alpha, \beta) \bigr) \end{aligned}$$

3. 다차원 지수족 벡터 내적 $\langle \boldsymbol{\theta}, \boldsymbol{\phi}(\mu) \rangle$ 형태로 정리:
   - 기저 측도: $h(\mu) = 1$
   - 자연모수 벡터: $\boldsymbol{\theta} = \begin{bmatrix} \theta_1 \\ \theta_2 \end{bmatrix} = \begin{bmatrix} \alpha - 1 \\ \beta - 1 \end{bmatrix}$
   - 충분통계량 벡터: $\boldsymbol{\phi}(\mu) = \begin{bmatrix} \ln \mu \\ \ln(1 - \mu) \end{bmatrix}$
   - 로그 분할함수: $A(\boldsymbol{\theta}) = \ln\text{B}(\alpha, \beta) = \ln\text{B}(\theta_1 + 1, \theta_2 + 1) = \ln\left( \frac{\Gamma(\theta_1 + 1)\Gamma(\theta_2 + 1)}{\Gamma(\theta_1 + \theta_2 + 2)} \right)$
4. 지수족 표현:

   $$\begin{aligned} &p(\mu \mid \boldsymbol{\theta}) = \exp\bigl( \boldsymbol{\theta}^\top \boldsymbol{\phi}(\mu) - A(\boldsymbol{\theta}) \bigr) \\ &\quad = \exp\bigl( (\alpha - 1)\ln \mu \\ &\quad + (\beta - 1)\ln(1 - \mu) - \ln\text{B}(\alpha, \beta) \bigr) \end{aligned}$$

**(c) 베타분포와 이항분포의 곱의 지수족 증명**
베이지안 추론에서 모수 $\mu$에 대한 결합확률(또는 비정규화 사후분포)로서 두 분포의 곱을 고려한다:
1. 두 확률밀도/질량함수의 곱 구성:
   $$\begin{aligned} &p(x, \mu) = p(x \mid \mu, N) p(\mu \mid \alpha, \beta) \\ &\quad = \bigl[ \binom{N}{x} \mu^x \\ &\quad (1 - \mu)^{N - x} \bigr] \times \biggl[ \frac{1}{\text{B}(\alpha, \beta)} \mu^{\alpha - 1} \\ &\quad (1 - \mu)^{\beta - 1} \biggr] \end{aligned}$$
2. $\mu$에 관한 밑이 같은 항들을 묶기:
   $$= \frac{\binom{N}{x}}{\text{B}(\alpha, \beta)} \mu^{(\alpha + x) - 1} (1 - \mu)^{(\beta + N - x) - 1}$$
3. 지수형태로 표현:

   $$\begin{aligned} &= \frac{\binom{N}{x}}{\text{B}(\alpha, \beta)} \exp\bigl( (\alpha + x - 1)\ln \mu \\ &\quad + (\beta + N - x - 1)\ln(1 - \mu) \bigr) \end{aligned}$$

4. 분석:
   $\mu$를 확률변수로 볼 때, 충분통계량은 $\boldsymbol{\phi}(\mu) = [\ln \mu, \ln(1 - \mu)]^\top$로 베타분포와 완전히 동일하며, 자연모수는 단순히 두 분포의 기여가 선형 합산된 형태이다:
   $$\begin{aligned} \tilde{\boldsymbol{\theta}} &= \begin{bmatrix} \alpha + x - 1 \\ \beta + N - x - 1 \end{bmatrix} \\ &= \boldsymbol{\theta}_{\text{Beta}} + \begin{bmatrix} x \\ N - x \end{bmatrix} \end{aligned}$$
   정규화 상수 $\text{B}(\alpha + x, \beta + N - x)$를 도입하면 이는 정확히 새로운 모수를 갖는 베타분포 $\text{Beta}(\alpha + x, \beta + N - x)$가 되며, 이는 여전히 지수족에 속한다. 따라서 베타분포와 이항분포의 곱은 지수족에 속한다.

**답:**
- **이항분포:** $p(x \mid \theta) = \binom{N}{x} \exp\left( \theta x - N \ln(1 + e^\theta) \right)$ ($\theta = \ln\frac{\mu}{1-\mu}$)
- **베타분포:** $p(\mu \mid \boldsymbol{\theta}) = \exp\Bigl( \boldsymbol{\theta}^\top \begin{bmatrix} \ln \mu \\ \ln(1 - \mu) \end{bmatrix} - \ln\text{B}(\theta_1 + 1, \theta_2 + 1) \Bigr)$ ($\boldsymbol{\theta} = [\alpha - 1, \beta - 1]^\top$)
- **곱의 지수족 성질:**  
  두 함수의 곱은 $\mu$에 대해 동일한 충분통계량 $[\ln \mu, \ln(1 - \mu)]^\top$을 공유하고 자연모수가 선형 덧셈으로 결합되어 갱신된 베타분포 $\text{Beta}(\alpha + x, \beta + N - x)$를 형성하므로, **지수족에 속함이 증명됨**.

---

### 6.10 두 가우시안 밀도의 곱 유도 (완전제곱식 및 지수족 관점)

**문제:**  
두 $D$차원 가우시안 확률밀도의 곱은 스케일된 비정규화 가우시안 분포가 됨을 (a) 완전제곱식 전개, (b) 지수족 표현 두 가지 방법으로 유도하라(교재 6.5.2절):
$$\begin{aligned} &\mathcal{N}(\mathbf{x} \mid \mathbf{a}, \mathbf{A}) \mathcal{N}(\mathbf{x} \mid \mathbf{b}, \mathbf{B}) \\ &\quad = c \, \mathcal{N}(\mathbf{x} \mid \mathbf{c}, \mathbf{C}) \end{aligned}$$
여기서
$$\mathbf{C} = (\mathbf{A}^{-1} + \mathbf{B}^{-1})^{-1}$$
$$\mathbf{c} = \mathbf{C}(\mathbf{A}^{-1}\mathbf{a} + \mathbf{B}^{-1}\mathbf{b})$$
$$\begin{aligned} c &= (2\pi)^{-\frac{D}{2}} |\mathbf{A} + \mathbf{B}|^{-\frac{1}{2}} \exp\biggl( -\frac{1}{2} \\ &\quad (\mathbf{a} - \mathbf{b})^\top (\mathbf{A} + \mathbf{B})^{-1} (\mathbf{a} - \mathbf{b}) \biggr) \\ &= \mathcal{N}(\mathbf{a} \mid \mathbf{b}, \mathbf{A} + \mathbf{B}) \end{aligned}$$

**풀이:**

**(a) 완전제곱식(Completing the Square)에 의한 유도**

1. **두 가우시안 밀도의 곱 식 세우기:**
   $$\begin{aligned} &\mathcal{N}(\mathbf{x} \mid \mathbf{a}, \mathbf{A})\mathcal{N}(\mathbf{x} \mid \mathbf{b}, \mathbf{B}) \\ &\quad = (2\pi)^{-D} |\mathbf{A}|^{-\frac{1}{2}} |\mathbf{B}|^{-\frac{1}{2}} \\ &\quad \exp\left( -\frac{1}{2} J(\mathbf{x}) \right) \end{aligned}$$
   여기서 지수부의 2차 형식 $J(\mathbf{x})$는 다음과 같다:
   $$\begin{aligned} J(\mathbf{x}) &= (\mathbf{x} - \mathbf{a})^\top \mathbf{A}^{-1}(\mathbf{x} - \mathbf{a}) \\ &\quad + (\mathbf{x} - \mathbf{b})^\top \mathbf{B}^{-1}(\mathbf{x} - \mathbf{b}) \end{aligned}$$
2. **$\mathbf{x}$에 대해 전개:**
   $$\begin{aligned} &J(\mathbf{x}) = \mathbf{x}^\top (\mathbf{A}^{-1} + \mathbf{B}^{-1}) \mathbf{x} \\ &\quad - 2\mathbf{x}^\top (\mathbf{A}^{-1}\mathbf{a} + \mathbf{B}^{-1}\mathbf{b}) + \mathbf{a}^\top \mathbf{A}^{-1}\mathbf{a} \\ &\quad + \mathbf{b}^\top \mathbf{B}^{-1}\mathbf{b} \end{aligned}$$
3. **새로운 정밀도 행렬 및 평균 정의:**
   $\mathbf{C}^{-1} = \mathbf{A}^{-1} + \mathbf{B}^{-1} \implies \mathbf{C} = (\mathbf{A}^{-1} + \mathbf{B}^{-1})^{-1}$,  
   $\mathbf{C}^{-1}\mathbf{c} = \mathbf{A}^{-1}\mathbf{a} + \mathbf{B}^{-1}\mathbf{b} \implies \mathbf{c} = \mathbf{C}(\mathbf{A}^{-1}\mathbf{a} + \mathbf{B}^{-1}\mathbf{b})$ 로 정의한다.
4. **완전제곱식 완성:**
   $$\begin{aligned} &\mathbf{x}^\top \mathbf{C}^{-1}\mathbf{x} - 2\mathbf{x}^\top \mathbf{C}^{-1}\mathbf{c} \\ &\quad = (\mathbf{x} - \mathbf{c})^\top \mathbf{C}^{-1}(\mathbf{x} - \mathbf{c}) - \mathbf{c}^\top \mathbf{C}^{-1}\mathbf{c} \end{aligned}$$
   따라서 $J(\mathbf{x})$는 다음과 같이 분해된다:
   $$J(\mathbf{x}) = (\mathbf{x} - \mathbf{c})^\top \mathbf{C}^{-1}(\mathbf{x} - \mathbf{c}) + \Delta$$
   여기서 $\mathbf{x}$와 무관한 잔여 상수항은 $\Delta = \mathbf{a}^\top \mathbf{A}^{-1}\mathbf{a} + \mathbf{b}^\top \mathbf{B}^{-1}\mathbf{b} - \mathbf{c}^\top \mathbf{C}^{-1}\mathbf{c}$ 이다.
5. **잔여 상수항 $\Delta$ 단순화 (Woodbury 행렬 항등식, 교재 밖 보충):**
   우드버리 공식에 의해 다음 항등식이 성립한다:
   $$\begin{aligned} &\mathbf{A}^{-1} - \mathbf{A}^{-1}(\mathbf{A}^{-1} + \mathbf{B}^{-1})^{-1}\mathbf{A}^{-1} \\ &\quad = (\mathbf{A} + \mathbf{B})^{-1} \end{aligned}$$
   $$\begin{aligned} &\mathbf{B}^{-1} - \mathbf{B}^{-1}(\mathbf{A}^{-1} + \mathbf{B}^{-1})^{-1}\mathbf{B}^{-1} \\ &\quad = (\mathbf{A} + \mathbf{B})^{-1} \end{aligned}$$
   $$\begin{aligned} &\mathbf{A}^{-1}(\mathbf{A}^{-1} + \mathbf{B}^{-1})^{-1}\mathbf{B}^{-1} \\ &\quad = (\mathbf{A} + \mathbf{B})^{-1} \end{aligned}$$
   이를 $\Delta$에 대입하여 $\mathbf{a}, \mathbf{b}$로 묶으면:
   $$\begin{aligned} \Delta &= \mathbf{a}^\top (\mathbf{A} + \mathbf{B})^{-1}\mathbf{a} \\ &\quad - 2\mathbf{a}^\top (\mathbf{A} + \mathbf{B})^{-1}\mathbf{b} \\ &\quad + \mathbf{b}^\top (\mathbf{A} + \mathbf{B})^{-1}\mathbf{b} \\ &= (\mathbf{a} - \mathbf{b})^\top (\mathbf{A} + \mathbf{B})^{-1} (\mathbf{a} - \mathbf{b}) \end{aligned}$$
6. **행렬식 정리:**
   $\mathbf{A}\mathbf{C}^{-1}\mathbf{B} = \mathbf{A}(\mathbf{A}^{-1} + \mathbf{B}^{-1})\mathbf{B} = \mathbf{B} + \mathbf{A}$ 이므로 $|\mathbf{A}|\,|\mathbf{C}^{-1}|\,|\mathbf{B}| = |\mathbf{A} + \mathbf{B}|$, 즉
   $$|\mathbf{A}|^{-\frac{1}{2}} |\mathbf{B}|^{-\frac{1}{2}} = |\mathbf{C}|^{-\frac{1}{2}} |\mathbf{A} + \mathbf{B}|^{-\frac{1}{2}}$$
7. **계수 $c$ 추출:**
   전체 식을 $(2\pi)^{-\frac{D}{2}}|\mathbf{C}|^{-\frac{1}{2}}\exp\bigl(-\frac{1}{2}(\mathbf{x}-\mathbf{c})^\top\mathbf{C}^{-1}(\mathbf{x}-\mathbf{c})\bigr) = \mathcal{N}(\mathbf{x} \mid \mathbf{c}, \mathbf{C})$로 묶어내면 남는 계수는:

   $$\begin{aligned} c &= (2\pi)^{-\frac{D}{2}} |\mathbf{A} + \mathbf{B}|^{-\frac{1}{2}} \exp\biggl( -\frac{1}{2} \\ &\quad (\mathbf{a} - \mathbf{b})^\top (\mathbf{A} + \mathbf{B})^{-1} (\mathbf{a} - \mathbf{b}) \biggr) \\ &= \mathcal{N}(\mathbf{a} \mid \mathbf{b}, \mathbf{A} + \mathbf{B}) \end{aligned}$$

**(b) 지수족 표현(Exponential Family Form)에 의한 유도**

1. **가우시안의 지수족 표준형 매개화:**  
   가우시안 분포 $\mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}, \boldsymbol{\Sigma})$의 정밀도 행렬을 $\boldsymbol{\Lambda} = \boldsymbol{\Sigma}^{-1}$이라 하면,
   $$\mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}, \boldsymbol{\Sigma}) \propto \exp\left( -\frac{1}{2}\mathbf{x}^\top \boldsymbol{\Lambda} \mathbf{x} + \mathbf{x}^\top (\boldsymbol{\Lambda}\boldsymbol{\mu}) \right)$$
   자연모수는 2차 통계량 $\mathbf{x}\mathbf{x}^\top$에 대응하는 $\boldsymbol{\Theta}_2 = -\frac{1}{2}\boldsymbol{\Lambda} = -\frac{1}{2}\boldsymbol{\Sigma}^{-1}$와, 1차 통계량 $\mathbf{x}$에 대응하는 $\boldsymbol{\theta}_1 = \boldsymbol{\Lambda}\boldsymbol{\mu} = \boldsymbol{\Sigma}^{-1}\boldsymbol{\mu}$이다.
2. **두 밀도의 곱에서의 자연모수 가산성:**  
   동일한 충분통계량을 갖는 두 지수족 밀도를 곱하면 지수의 덧셈에 의해 자연모수가 단순히 더해진다:
   $$\boldsymbol{\Theta}_{2, \text{new}} = \boldsymbol{\Theta}_{2, A} + \boldsymbol{\Theta}_{2, B} = -\frac{1}{2}\mathbf{A}^{-1} + \left(-\frac{1}{2}\mathbf{B}^{-1}\right) = -\frac{1}{2}(\mathbf{A}^{-1} + \mathbf{B}^{-1})$$
   $$\boldsymbol{\theta}_{1, \text{new}} = \boldsymbol{\theta}_{1, A} + \boldsymbol{\theta}_{1, B} = \mathbf{A}^{-1}\mathbf{a} + \mathbf{B}^{-1}\mathbf{b}$$
3. **새로운 평균과 공분산 복원:**  
   $-\frac{1}{2}\mathbf{C}^{-1} = \boldsymbol{\Theta}_{2, \text{new}} \implies \mathbf{C}^{-1} = \mathbf{A}^{-1} + \mathbf{B}^{-1} \implies \mathbf{C} = (\mathbf{A}^{-1} + \mathbf{B}^{-1})^{-1}$.  
   $\mathbf{C}^{-1}\mathbf{c} = \boldsymbol{\theta}_{1, \text{new}} \implies \mathbf{c} = \mathbf{C}(\mathbf{A}^{-1}\mathbf{a} + \mathbf{B}^{-1}\mathbf{b})$.  
   이로써 지수족의 매개화를 통해 $\mathbf{c}$와 $\mathbf{C}$의 형태가 즉각 도출된다.
4. **상수 $c$도 같은 방식으로:**  
   가우시안을 $\mathcal{N}(\mathbf{x} \mid \boldsymbol{\mu}, \boldsymbol{\Sigma}) = (2\pi)^{-D/2}\exp\big(\boldsymbol{\theta}_1^\top\mathbf{x} + \text{tr}(\boldsymbol{\Theta}_2\mathbf{x}\mathbf{x}^\top) - A(\boldsymbol{\mu},\boldsymbol{\Sigma})\big)$, $A(\boldsymbol{\mu},\boldsymbol{\Sigma}) = \frac12\boldsymbol{\mu}^\top\boldsymbol{\Sigma}^{-1}\boldsymbol{\mu} + \frac12\log|\boldsymbol{\Sigma}|$로 쓰면, 두 밀도의 곱은
   $$(2\pi)^{-D}\exp\big(\boldsymbol{\theta}_{1,\text{new}}^\top\mathbf{x} + \text{tr}(\boldsymbol{\Theta}_{2,\text{new}}\mathbf{x}\mathbf{x}^\top) - A_a - A_b\big) = (2\pi)^{-D/2}e^{A_c - A_a - A_b}\cdot\mathcal{N}(\mathbf{x} \mid \mathbf{c}, \mathbf{C})$$
   이므로 $c = (2\pi)^{-D/2}\exp(A_c - A_a - A_b)$이다. (a)의 6단계와 5단계를 쓰면 $A_c - A_a - A_b = \frac12\log\frac{|\mathbf{C}|}{|\mathbf{A}||\mathbf{B}|} - \frac12\big(\mathbf{a}^\top\mathbf{A}^{-1}\mathbf{a} + \mathbf{b}^\top\mathbf{B}^{-1}\mathbf{b} - \mathbf{c}^\top\mathbf{C}^{-1}\mathbf{c}\big) = -\frac12\log|\mathbf{A}+\mathbf{B}| - \frac12\Delta$. 따라서 $c = (2\pi)^{-D/2}|\mathbf{A}+\mathbf{B}|^{-1/2}\exp\big(-\frac12(\mathbf{a}-\mathbf{b})^\top(\mathbf{A}+\mathbf{B})^{-1}(\mathbf{a}-\mathbf{b})\big) = \mathcal{N}(\mathbf{a} \mid \mathbf{b}, \mathbf{A}+\mathbf{B})$로 (a)와 같다.

**답:**  

$$\begin{aligned} &\mathcal{N}(\mathbf{x} \mid \mathbf{a}, \mathbf{A})\mathcal{N}(\mathbf{x} \mid \mathbf{b}, \mathbf{B}) \\ &\quad = c \, \mathcal{N}(\mathbf{x} \mid \mathbf{c}, \mathbf{C}) \end{aligned}$$

$$\begin{gathered} \mathbf{C} = (\mathbf{A}^{-1} + \mathbf{B}^{-1})^{-1}, \\ \mathbf{c} = \mathbf{C}(\mathbf{A}^{-1}\mathbf{a} + \mathbf{B}^{-1}\mathbf{b}) \end{gathered}$$  
$$\begin{aligned} &c = \mathcal{N}(\mathbf{a} \mid \mathbf{b}, \mathbf{A} + \mathbf{B}) \\ &\quad = (2\pi)^{-\frac{D}{2}} |\mathbf{A} + \mathbf{B}|^{-\frac{1}{2}} \exp\biggl( -\frac{1}{2} \\ &\quad (\mathbf{a} - \mathbf{b})^\top (\mathbf{A} + \mathbf{B})^{-1} (\mathbf{a} - \mathbf{b}) \biggr) \\ &\text{(유도 완료)} \end{aligned}$$

---

### 6.11 반복 기댓값의 법칙 증명

**문제:**  
결합분포 $p(x, y)$를 따르는 두 확률변수 $X, Y$에 대해 반복 기댓값의 법칙(Law of Iterated Expectations)을 증명하라:
$$\mathbb{E}_X[x] = \mathbb{E}_Y\left[ \mathbb{E}_X[x \mid y] \right]$$

**풀이:**

1. **기댓값의 정의(교재 정의 6.3)를 조건부 분포에 적용:**  
   주어진 $Y = y$ 하에서 $X$의 조건부 기댓값은 다음과 같다:
   $$\mathbb{E}_X[x \mid y] = \int_{-\infty}^\infty x \, p(x \mid y) \, dx$$
2. **외부 기댓값 $\mathbb{E}_Y[\cdot]$의 정의 적용:**  
   위의 조건부 기댓값은 $y$의 함수이므로, $Y$의 주변분포 $p(y)$에 대한 기댓값을 취한다:
   $$\mathbb{E}_Y\left[ \mathbb{E}_X[x \mid y] \right] = \int_{-\infty}^\infty \left( \int_{-\infty}^\infty x \, p(x \mid y) \, dx \right) p(y) \, dy$$
3. **적분 순서 교환(푸비니 정리, 교재 밖 보충):**  
   피적분함수의 절댓값 적분이 유한하다고 가정할 때 적분 순서를 바꾼다:
   $$= \int_{-\infty}^\infty \int_{-\infty}^\infty x \, p(x \mid y) p(y) \, dy \, dx$$
4. **곱의 법칙(교재 식 (6.22)) 적용:**  
   조건부 확률과 주변확률의 곱은 결합확률이다 ($p(x \mid y) p(y) = p(x, y)$):
   $$= \int_{-\infty}^\infty \int_{-\infty}^\infty x \, p(x, y) \, dy \, dx$$
5. **$x$를 $y$에 대한 적분 밖으로 분리:**  
   $$= \int_{-\infty}^\infty x \left( \int_{-\infty}^\infty p(x, y) \, dy \right) dx$$
6. **합의 법칙(주변화, 교재 식 (6.20)) 적용:**  
   결합확률을 $y$에 대해 전체 적분하면 $X$의 주변확률밀도함수 $p(x)$가 된다 ($\int p(x, y) dy = p(x)$):
   $$= \int_{-\infty}^\infty x \, p(x) \, dx$$
7. **기댓값의 정의(교재 정의 6.4)에 도달:**  
   이는 $X$의 비조건부 기댓값 $\mathbb{E}_X[x]$의 정의이다:
   $$= \mathbb{E}_X[x]$$
   따라서 $\mathbb{E}_X[x] = \mathbb{E}_Y[\mathbb{E}_X[x \mid y]]$가 완전히 증명되었다.

**답:**  

$$\begin{aligned} &\mathbb{E}_Y[\mathbb{E}_X[x \mid y]] \\ &\quad = \int_y \int_x x p(x \mid y)p(y) \, dx dy \\ &\quad = \int_x x \left(\int_y p(x, y) dy\right) dx \\ &\quad = \int_x x p(x) dx = \mathbb{E}_X[x] \\ &\text{(증명 완료)} \end{aligned}$$

---

### 6.12 선형 가우시안 시스템의 주변분포 및 조건부 사후분포 유도

**문제:**  
가우시안 확률변수 $\mathbf{x} \sim \mathcal{N}(\boldsymbol{\mu}_x, \boldsymbol{\Sigma}_x)$ ($\mathbf{x} \in \mathbb{R}^D$)와 선형 관측 모델
$$\mathbf{y} = \mathbf{A}\mathbf{x} + \mathbf{b} + \mathbf{w}, \quad \mathbf{w} \sim \mathcal{N}(\mathbf{0}, \mathbf{Q})$$
($\mathbf{y} \in \mathbb{R}^E$, $\mathbf{A} \in \mathbb{R}^{E \times D}$, $\mathbf{b} \in \mathbb{R}^E$, $\mathbf{w}$는 $\mathbf{x}$와 독립인 가우시안 노이즈, $\mathbf{Q}$는 대각행렬)을 고려하라.  
(a) 우도함수 $p(\mathbf{y} \mid \mathbf{x})$를 구하라.  
(b) 주변분포 $p(\mathbf{y}) = \int p(\mathbf{y} \mid \mathbf{x})p(\mathbf{x})d\mathbf{x}$의 평균 $\boldsymbol{\mu}_y$와 공분산 $\boldsymbol{\Sigma}_y$를 상세히 유도하라.  
(c) 관측 변환 $\mathbf{z} = \mathbf{C}\mathbf{y} + \mathbf{v}$ ($\mathbf{v} \sim \mathcal{N}(\mathbf{0}, \mathbf{R})$는 독립 노이즈)에 대해 $p(\mathbf{z} \mid \mathbf{y})$와 $p(\mathbf{z})$의 평균 $\boldsymbol{\mu}_z$, 공분산 $\boldsymbol{\Sigma}_z$를 구하라.  
(d) 측정값 $\hat{\mathbf{y}}$가 주어졌을 때 사후분포 $p(\mathbf{x} \mid \hat{\mathbf{y}})$를 유도하라. (교차공분산과 가우시안 조건부 공식을 적용)

**풀이:**

**(a) 우도함수 $p(\mathbf{y} \mid \mathbf{x})$의 도출**
$\mathbf{x}$가 주어졌을 때, $\mathbf{A}\mathbf{x} + \mathbf{b}$는 결정론적 상수 벡터이다. 따라서 $\mathbf{y}$의 확률적 불확실성은 전적으로 노이즈 $\mathbf{w} \sim \mathcal{N}(\mathbf{0}, \mathbf{Q})$에서 비롯된다.
1. 평균: $\mathbb{E}[\mathbf{y} \mid \mathbf{x}] = \mathbf{A}\mathbf{x} + \mathbf{b} + \mathbb{E}[\mathbf{w}] = \mathbf{A}\mathbf{x} + \mathbf{b}$
2. 공분산: $\mathbb{V}[\mathbf{y} \mid \mathbf{x}] = \mathbb{V}[\mathbf{w}] = \mathbf{Q}$
3. 따라서 조건부 분포:

   $$\begin{aligned} p(\mathbf{y} \mid \mathbf{x}) &= \mathcal{N}(\mathbf{y} \mid \mathbf{A}\mathbf{x} + \mathbf{b}, \mathbf{Q}) \\ &= (2\pi)^{-\frac{E}{2}}|\mathbf{Q}|^{-\frac{1}{2}} \exp\biggl( -\frac{1}{2} \\ &\quad (\mathbf{y} - \mathbf{A}\mathbf{x} - \mathbf{b})^\top \mathbf{Q}^{-1} \\ &\quad (\mathbf{y} - \mathbf{A}\mathbf{x} - \mathbf{b}) \biggr) \end{aligned}$$

**(b) 주변분포 $p(\mathbf{y})$의 평균과 공분산 유도**
1. **평균 $\boldsymbol{\mu}_y$ 유도:** 기댓값의 선형성에 의해:
   $$\begin{aligned} \boldsymbol{\mu}_y &= \mathbb{E}[\mathbf{y}] = \mathbb{E}[\mathbf{A}\mathbf{x} + \mathbf{b} + \mathbf{w}] \\ &= \mathbf{A}\mathbb{E}[\mathbf{x}] + \mathbf{b} + \mathbb{E}[\mathbf{w}] = \mathbf{A}\boldsymbol{\mu}_x + \mathbf{b} \end{aligned}$$
2. **공분산 $\boldsymbol{\Sigma}_y$ 유도:** 공분산의 정의를 적용한다:
   $$\boldsymbol{\Sigma}_y = \mathbb{E}\left[ (\mathbf{y} - \boldsymbol{\mu}_y)(\mathbf{y} - \boldsymbol{\mu}_y)^\top \right]$$
   편차 벡터는 다음과 같다:
   $$\begin{aligned} &\mathbf{y} - \boldsymbol{\mu}_y \\ &\quad = (\mathbf{A}\mathbf{x} + \mathbf{b} + \mathbf{w}) - (\mathbf{A}\boldsymbol{\mu}_x + \mathbf{b}) \\ &\quad = \mathbf{A}(\mathbf{x} - \boldsymbol{\mu}_x) + \mathbf{w} \end{aligned}$$
   이를 대입하여 전개한다:

   $$\begin{aligned} \boldsymbol{\Sigma}_y &= \mathbb{E}\bigl[ (\mathbf{A}(\mathbf{x} - \boldsymbol{\mu}_x) + \mathbf{w}) \\ &\quad (\mathbf{A}(\mathbf{x} - \boldsymbol{\mu}_x) + \mathbf{w})^\top \bigr] \end{aligned}$$

   $$\begin{aligned} &= \mathbf{A}\mathbb{E}\left[(\mathbf{x} - \boldsymbol{\mu}_x)(\mathbf{x} - \boldsymbol{\mu}_x)^\top\right]\mathbf{A}^\top \\ &\quad + \mathbf{A}\mathbb{E}\left[(\mathbf{x} - \boldsymbol{\mu}_x)\mathbf{w}^\top\right] \\ &\quad + \mathbb{E}\left[\mathbf{w}(\mathbf{x} - \boldsymbol{\mu}_x)^\top\right]\mathbf{A}^\top + \mathbb{E}[\mathbf{w}\mathbf{w}^\top] \end{aligned}$$
3. **독립성 적용:** $\mathbf{x}$와 $\mathbf{w}$가 독립이므로 교차 기댓값은 0이다 ($\mathbb{E}[(\mathbf{x} - \boldsymbol{\mu}_x)\mathbf{w}^\top] = \mathbf{0}$).
   $$\boldsymbol{\Sigma}_y = \mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q}$$
4. 가우시안의 선형 변환 및 합은 가우시안이므로(교재 6.5.3절):
   $$p(\mathbf{y}) = \mathcal{N}(\mathbf{A}\boldsymbol{\mu}_x + \mathbf{b}, \; \mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q})$$

**(c) 관측 변환 $\mathbf{z} = \mathbf{C}\mathbf{y} + \mathbf{v}$의 주변분포 유도**
1. **조건부 분포:** $\mathbf{y}$가 주어졌을 때 $\mathbf{z}$는 평균 $\mathbf{C}\mathbf{y}$, 공분산 $\mathbf{R}$을 가지므로:
   $$p(\mathbf{z} \mid \mathbf{y}) = \mathcal{N}(\mathbf{z} \mid \mathbf{C}\mathbf{y}, \mathbf{R})$$
2. **주변분포의 평균 $\boldsymbol{\mu}_z$:**
   $$\boldsymbol{\mu}_z = \mathbb{E}[\mathbf{z}] = \mathbf{C}\mathbb{E}[\mathbf{y}] + \mathbb{E}[\mathbf{v}] = \mathbf{C}\boldsymbol{\mu}_y = \mathbf{C}(\mathbf{A}\boldsymbol{\mu}_x + \mathbf{b}) = \mathbf{C}\mathbf{A}\boldsymbol{\mu}_x + \mathbf{C}\mathbf{b}$$
3. **주변분포의 공분산 $\boldsymbol{\Sigma}_z$:**
   $$\mathbf{z} - \boldsymbol{\mu}_z = \mathbf{C}(\mathbf{y} - \boldsymbol{\mu}_y) + \mathbf{v}$$
   $\mathbf{y}$와 $\mathbf{v}$의 독립성에 의해:
   $$\boldsymbol{\Sigma}_z = \mathbb{V}[\mathbf{z}] = \mathbf{C}\mathbb{V}[\mathbf{y}]\mathbf{C}^\top + \mathbb{V}[\mathbf{v}] = \mathbf{C}\boldsymbol{\Sigma}_y\mathbf{C}^\top + \mathbf{R} = \mathbf{C}(\mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q})\mathbf{C}^\top + \mathbf{R}$$
4. 따라서 $p(\mathbf{z}) = \mathcal{N}(\mathbf{C}\mathbf{A}\boldsymbol{\mu}_x + \mathbf{C}\mathbf{b}, \; \mathbf{C}(\mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q})\mathbf{C}^\top + \mathbf{R})$.

**(d) 사후분포 $p(\mathbf{x} \mid \hat{\mathbf{y}})$의 유도**
1. **교차공분산(Cross-covariance) 계산:**
   $$\begin{aligned} \text{Cov}[\mathbf{x}, \mathbf{y}] &= \mathbb{E}\bigl[ (\mathbf{x} - \boldsymbol{\mu}_x)(\mathbf{y} - \boldsymbol{\mu}_y)^\top \bigr] \\ &= \mathbb{E}\bigl[ (\mathbf{x} - \boldsymbol{\mu}_x) \\ &\quad (\mathbf{A}(\mathbf{x} - \boldsymbol{\mu}_x) + \mathbf{w})^\top \bigr] \end{aligned}$$
   $$\begin{aligned} &= \mathbb{E}\left[(\mathbf{x} - \boldsymbol{\mu}_x)(\mathbf{x} - \boldsymbol{\mu}_x)^\top\right]\mathbf{A}^\top + \mathbf{0} \\ &\quad = \boldsymbol{\Sigma}_x\mathbf{A}^\top \end{aligned}$$
   대칭성에 의해 $\text{Cov}[\mathbf{y}, \mathbf{x}] = (\text{Cov}[\mathbf{x}, \mathbf{y}])^\top = \mathbf{A}\boldsymbol{\Sigma}_x$.
2. **결합 가우시안 분포 구성:**

   $$\begin{aligned} &\begin{bmatrix} \mathbf{x} \\ \mathbf{y} \end{bmatrix} \sim \mathcal{N}\left( \begin{bmatrix} \boldsymbol{\mu}_x \\ \mathbf{A}\boldsymbol{\mu}_x + \mathbf{b} \end{bmatrix}, \right. \\ &\qquad \left. \begin{bmatrix} \boldsymbol{\Sigma}_x & \boldsymbol{\Sigma}_x\mathbf{A}^\top \\ \mathbf{A}\boldsymbol{\Sigma}_x & \mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q} \end{bmatrix} \right) \end{aligned}$$

3. **가우시안 조건부 분포 공식(교재 6.5.1절 식 (6.65)~(6.67)) 적용:**  
   이득 행렬(칼만 이득 형태)을 $\mathbf{K} = \text{Cov}[\mathbf{x}, \mathbf{y}] (\mathbb{V}[\mathbf{y}])^{-1}$로 정의한다:
   $$\mathbf{K} = \boldsymbol{\Sigma}_x\mathbf{A}^\top (\mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q})^{-1}$$
4. 사후분포의 평균:
   $$\boldsymbol{\mu}_{x \mid \hat{y}} = \boldsymbol{\mu}_x + \mathbf{K}(\hat{\mathbf{y}} - \mathbf{A}\boldsymbol{\mu}_x - \mathbf{b})$$
5. 사후분포의 공분산:
   $$\boldsymbol{\Sigma}_{x \mid \hat{y}} = \boldsymbol{\Sigma}_x - \mathbf{K} \mathbf{A}\boldsymbol{\Sigma}_x = (\mathbf{I} - \mathbf{K}\mathbf{A})\boldsymbol{\Sigma}_x$$
6. 따라서 사후분포는 다음과 같다:

   $$\begin{aligned} &p(\mathbf{x} \mid \hat{\mathbf{y}}) \\ &\quad = \mathcal{N}\bigl( \boldsymbol{\mu}_x + \mathbf{K}(\hat{\mathbf{y}} - \mathbf{A}\boldsymbol{\mu}_x - \mathbf{b}), \\ &\quad \; (\mathbf{I} - \mathbf{K}\mathbf{A})\boldsymbol{\Sigma}_x \bigr) \end{aligned}$$

**답:**
- **(a)**

  $$p(\mathbf{y} \mid \mathbf{x}) = \mathcal{N}(\mathbf{A}\mathbf{x} + \mathbf{b}, \mathbf{Q})$$

- **(b)**

  $$\begin{gathered} \boldsymbol{\mu}_y = \mathbf{A}\boldsymbol{\mu}_x + \mathbf{b}, \\ \boldsymbol{\Sigma}_y = \mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q} \end{gathered}$$

  $$p(\mathbf{y}) = \mathcal{N}(\mathbf{A}\boldsymbol{\mu}_x + \mathbf{b}, \; \mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q})$$
- **(c)**

  $$p(\mathbf{z} \mid \mathbf{y}) = \mathcal{N}(\mathbf{C}\mathbf{y}, \mathbf{R})$$

  $$\begin{gathered} \boldsymbol{\mu}_z = \mathbf{C}\mathbf{A}\boldsymbol{\mu}_x + \mathbf{C}\mathbf{b}, \\ \boldsymbol{\Sigma}_z = \mathbf{C}(\mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q})\mathbf{C}^\top + \mathbf{R} \end{gathered}$$
- **(d)**

  $$p(\mathbf{x} \mid \hat{\mathbf{y}}) = \mathcal{N}(\boldsymbol{\mu}_{x \mid \hat{y}}, \boldsymbol{\Sigma}_{x \mid \hat{y}})$$

  $$\mathbf{K} = \boldsymbol{\Sigma}_x\mathbf{A}^\top (\mathbf{A}\boldsymbol{\Sigma}_x\mathbf{A}^\top + \mathbf{Q})^{-1}$$  
  $$\boldsymbol{\mu}_{x \mid \hat{y}} = \boldsymbol{\mu}_x + \mathbf{K}(\hat{\mathbf{y}} - \mathbf{A}\boldsymbol{\mu}_x - \mathbf{b})$$  
  $$\boldsymbol{\Sigma}_{x \mid \hat{y}} = (\mathbf{I} - \mathbf{K}\mathbf{A})\boldsymbol{\Sigma}_x$$

---

### 6.13 확률적분변환 (Probability Integral Transformation)

**문제:**  
누적분포함수(CDF)가 $F_X(x)$인 연속확률변수 $X$가 주어졌을 때, 변환된 확률변수 $Y := F_X(X)$가 구간 $[0, 1]$에서의 균등분포(Uniform distribution)를 따름을 보여라(교재 정리 6.15).

**풀이:**

1. **변환된 확률변수 $Y$의 치역(지원역, Support) 확인:**  
   누적분포함수의 정의 $F_X(x) = P(X \le x)$에 의해 임의의 $x \in \mathbb{R}$에 대해 $0 \le F_X(x) \le 1$이다.  
   따라서 확률변수 $Y = F_X(X)$가 취할 수 있는 값의 범위는 구간 $[0, 1]$이다.
2. **$Y$의 누적분포함수 $F_Y(y)$ 세우기:**  
   교재 정의 6.2(누적분포함수)에 따라 임의의 $y \in (0, 1)$에 대해:
   $$F_Y(y) = P(Y \le y)$$
3. **$Y = F_X(X)$ 치환:**  
   $$F_Y(y) = P\left( F_X(X) \le y \right)$$
4. **역함수의 단조증가성 적용:**  
   정리 6.15의 조건에 따라 $F_X(x)$는 엄격히 단조증가(strictly monotonically increasing)하는 연속함수이므로, 역함수 $F_X^{-1}$가 유일하게 존재하며 이 역시 엄격한 단조증가함수이다.  
   따라서 부등식의 양변에 $F_X^{-1}$를 취해도 부등호 방향이 보존된다:
   $$P\left( F_X(X) \le y \right) = P\left( X \le F_X^{-1}(y) \right)$$
5. **$X$의 누적분포함수 정의 적용:**  
   우변은 확률변수 $X$가 실수값 $F_X^{-1}(y)$ 이하일 확률이므로, $X$의 CDF의 정의 그 자체이다:
   $$P\left( X \le F_X^{-1}(y) \right) = F_X\left( F_X^{-1}(y) \right)$$
6. **함수와 역함수의 상쇄:**  
   연속함수와 그 역함수의 정의에 의해 $F_X(F_X^{-1}(y)) = y$ 이다:
   $$F_Y(y) = y \quad (0 \le y \le 1)$$
7. **누적분포함수 전체 범위 완성:**  
   $$F_Y(y) = \begin{cases} 0, & y < 0 \\ y, & 0 \le y \le 1 \\ 1, & y > 1 \end{cases}$$
8. **확률밀도함수(PDF) 도출:**  
   CDF를 $y$에 대해 미분한다(밀도는 누적분포함수의 도함수, 교재 6.7.1절):
   $$f_Y(y) = \frac{d}{dy} F_Y(y) = \begin{cases} 1, & 0 \le y \le 1 \\ 0, & \text{그 외} \end{cases}$$
   이는 구간 $[0, 1]$에서 정의된 연속균등분포 $\text{Uniform}(0, 1)$의 확률밀도함수와 정확히 일치한다.

*(교재 밖 보충: $F_X$에 평평한 구간이 있어도 $F_X$가 연속이기만 하면 결론은 그대로 성립한다. 이때는 일반화 역함수 $F_X^{-1}(y) := \inf\{x : F_X(x) \ge y\}$로 같은 논리를 편다. 교재 정리 6.15는 이 경우를 다루지 않고 "엄격히 단조"를 가정한다.)*

**답:**  

$$\begin{aligned} &F_Y(y) = P(F_X(X) \le y) \\ &\quad = P(X \le F_X^{-1}(y)) = F_X(F_X^{-1}(y)) \\ &\quad = y\quad (0 \le y \le 1) \end{aligned}$$

$$\begin{aligned} &f_Y(y) = \frac{d}{dy}F_Y(y) = 1 \\ &\quad \implies Y \sim \text{Uniform}(0, 1) \\ &\text{(증명 완료)} \end{aligned}$$

---

## 7장 연속 최적화

> **검산:** 7.1의 함숫값, 7.6·7.7의 원문제·쌍대문제 최적값을 scipy로 다시 풀어 확인했다. MML 7장 본문에 없는 개념(상보 여유성, 로빈스-먼로 조건, 펜첼-영 부등식)은 "(교재 밖 보충)"으로 표시했다.

### 7.1 일변수 3차 다항식의 정류점 및 극대·극소·안장점 판정

**문제:**  
일변수 함수 $f(x) = x^3 + 6x^2 - 3x - 5$의 정류점(stationary points)을 모두 찾고, 각 정류점이 극댓값(maximum), 극솟값(minimum), 안장점(saddle point) 중 무엇인지 판정하라.

**풀이:**  
1. **1계 도함수 계산:**  
   함수 $f(x)$를 $x$에 대해 미분하여 1계 도함수를 구한다.  
   $$f'(x) = \frac{d}{dx}(x^3 + 6x^2 - 3x - 5) = 3x^2 + 12x - 3$$
2. **정류점 방정식 설정 및 정리:**  
   정류점(stationary point)은 1계 도함수가 0이 되는 점이므로 방정식을 세운다.  
   $$3x^2 + 12x - 3 = 0$$  
   양변을 3으로 나눈다.  
   $$x^2 + 4x - 1 = 0$$
3. **근의 공식을 이용한 정류점 도출:**  
   2차방정식 근의 공식을 적용하여 해를 구한다.  
   $$x = \frac{-4 \pm \sqrt{4^2 - 4(1)(-1)}}{2(1)} = \frac{-4 \pm \sqrt{16 + 4}}{2} = \frac{-4 \pm \sqrt{20}}{2} = -2 \pm \sqrt{5}$$  
   따라서 정류점은 다음 두 개이다.  
   $$x_1 = -2 - \sqrt{5} \approx -4.2361, \quad x_2 = -2 + \sqrt{5} \approx 0.2361$$
4. **2계 도함수 계산:**  
   극대·극소 판정을 위해 $f'(x)$를 한 번 더 미분하여 2계 도함수를 구한다.  
   $$f''(x) = \frac{d}{dx}(3x^2 + 12x - 3) = 6x + 12 = 6(x + 2)$$
5. **각 정류점에서 2계 도함수 부호 판정:**  
   - 첫 번째 정류점 $x_1 = -2 - \sqrt{5}$ 대입:  
     $$f''(-2 - \sqrt{5}) = 6((-2 - \sqrt{5}) + 2) = -6\sqrt{5} < 0$$  
     2계 도함수가 음수이므로 함수는 위로 볼록(concave down)하며, $x_1$은 **극댓값(local maximum)**\ 이다.  
   - 두 번째 정류점 $x_2 = -2 + \sqrt{5}$ 대입:  
     $$f''(-2 + \sqrt{5}) = 6((-2 + \sqrt{5}) + 2) = 6\sqrt{5} > 0$$  
     2계 도함수가 양수이므로 함수는 아래로 볼록(convex)하며, $x_2$는 **극솟값(local minimum)**\ 이다.
6. **안장점(saddle point / 수평 변곡점) 존재 여부 검토:**  
   일변수 함수에서 정류점이면서 안장점이 되려면 $f'(x) = 0$과 $f''(x) = 0$을 동시에 만족해야 한다.  
   $f''(x) = 6(x + 2) = 0$을 만족하는 변곡점은 $x = -2$뿐이다.  
   $x = -2$에서의 1계 도함수를 계산하면:  
   $$f'(-2) = 3(-2)^2 + 12(-2) - 3 = 12 - 24 - 3 = -15 \ne 0$$  
   따라서 $x = -2$는 정류점이 아니므로, 이 함수에 안장점은 존재하지 않는다.

**답:**  
- **정류점:** $\boldsymbol{x = -2 - \sqrt{5}}$ 및 $\boldsymbol{x = -2 + \sqrt{5}}$
- **판정:**  
  - $\boldsymbol{x = -2 - \sqrt{5} \approx -4.236}$: **극대 (local maximum)**  
  - $\boldsymbol{x = -2 + \sqrt{5} \approx 0.236}$: **극소 (local minimum)**  
  - **안장점: 없음**

**확인:**  
극대점과 극소점에서의 실제 함숫값을 계산하여 그래프의 개형을 확인한다.  
$$\begin{aligned} &f(-2 - \sqrt{5}) \\ &\quad = (-2 - \sqrt{5})^3 + 6(-2 - \sqrt{5})^2 \\ &\quad - 3(-2 - \sqrt{5}) - 5 \\ &\quad = 17 + 10\sqrt{5} \approx 39.3607 \end{aligned}$$  
$$\begin{aligned} &f(-2 + \sqrt{5}) \\ &\quad = (-2 + \sqrt{5})^3 + 6(-2 + \sqrt{5})^2 \\ &\quad - 3(-2 + \sqrt{5}) - 5 \\ &\quad = 17 - 10\sqrt{5} \approx -5.3607 \end{aligned}$$  
3차 다항식의 최고차항 계수가 $+1 > 0$이므로 $x \to -\infty$에서 $-\infty$로부터 증가하여 $x \approx -4.236$에서 극댓값 $\approx 39.36$을 찍고 감소한 뒤, $x \approx 0.236$에서 극솟값 $\approx -5.36$을 찍고 $x \to +\infty$로 증가하는 전형적인 3차 다항식 곡선 개형과 정확히 일치한다.

---

### 7.2 확률적 경사하강법(SGD)의 미니배치 크기 1 갱신식

**문제:**  
전체 손실함수의 합에 대한 경사하강법 식 (7.15)
$$\begin{aligned} \theta_{i+1} &= \theta_i - \gamma_i (\nabla L(\theta_i))^\top \\ &= \theta_i - \gamma_i \sum_{n=1}^N (\nabla L_n(\theta_i))^\top \end{aligned}$$
에서, 미니배치 크기(mini-batch size)가 1일 때의 파라미터 갱신식을 작성하라.

**풀이:**  
1. **교재 식 (7.15)의 구조 분석:**  
   전체 손실함수 $L(\theta)$는 $N$개의 훈련 데이터 샘플에 대한 개별 손실 $L_n(\theta)$의 단순 합으로 정의된다.  
   $$L(\theta) = \sum_{n=1}^N L_n(\theta)$$  
   전체 그래디언트는 미분의 선형성에 의해 각 샘플 그래디언트의 합이다.  
   $$\nabla L(\theta) = \sum_{n=1}^N \nabla L_n(\theta)$$
2. **미니배치 확률적 경사하강법의 원리:**  
   대규모 데이터셋에서는 $N$개 전체 샘플의 그래디언트를 매 반복마다 계산하는 비용이 지나치게 크므로, 각 단계 $i$에서 인덱스 집합 $\{1, \dots, N\}$의 부분집합 $\mathcal{B}_i$ (크기 $|\mathcal{B}_i| = M$)를 무작위로 추출하여 전체 그래디언트를 추정한다.
3. **미니배치 크기 1 ($M = 1$)의 적용:**  
   미니배치 크기가 1인 극단적인 경우(교재 7.1.3절, 231쪽), 매 반복 $i$마다 전체 $N$개의 데이터 중 단 하나의 샘플 인덱스 $n_i \in \{1, \dots, N\}$를 균등 확률(확률 $1/N$)로 독립 무작위 추출(uniform random sampling)한다.
4. **합 기호 $\sum_{n=1}^N$을 단일 샘플로 대체:**  
   전체 합 $\sum_{n=1}^N (\nabla L_n(\theta_i))^\top$ 대신 무작위로 선택된 단일 샘플의 그래디언트 $(\nabla L_{n_i}(\theta_i))^\top$을 직접 대입하여 파라미터를 갱신한다.  
   $$\theta_{i+1} = \theta_i - \gamma_i (\nabla L_{n_i}(\theta_i))^\top$$
5. **무편향 추정량과 스케일링 설명:**  
   확률변수 $n_i$에 대한 기댓값을 취하면 다음과 같다.  
   $$\mathbb{E}_{n_i}\left[(\nabla L_{n_i}(\theta_i))^\top\right] = \sum_{k=1}^N \frac{1}{N} (\nabla L_k(\theta_i))^\top = \frac{1}{N} (\nabla L(\theta_i))^\top$$  
   따라서 단일 샘플 그래디언트는 전체 평균 손실 $\frac{1}{N}L(\theta)$의 그래디언트에 대한 무편향 추정량(unbiased estimator)이다. 만약 전체 합 $L(\theta)$의 그래디언트 크기와 정확히 맞추고자 한다면 $N (\nabla L_{n_i}(\theta_i))^\top$으로 쓸 수도 있으나, 머신러닝 관례 및 교재 7.1.3절에서는 비례 상수 $N$이 학습률 $\gamma_i$의 조정에 흡수되므로 단일 샘플 그래디언트를 직접 차감하는 형태로 작성한다.

**답:**  
$$\boldsymbol{\theta_{i+1} = \theta_i - \gamma_i (\nabla L_{n_i}(\theta_i))^\top}$$  
**(단, $n_i \in \{1, \dots, N\}$은 $i$번째 갱신 단계에서 $\{1, \dots, N\}$ 중 균등한 확률로 무작위 선택된 단일 데이터 샘플의 인덱스이며, $\gamma_i > 0$는 학습률(보폭)이다.)**  
*(참고: 전체 합 손실의 크기 스케일을 엄격히 유지하는 관점에서는 $\theta_{i+1} = \theta_i - \gamma_i N (\nabla L_{n_i}(\theta_i))^\top$로 표기할 수도 있으며, 이는 상수 $N$이 학습률에 통합되기 전의 형태와 동치이다.)*

**확인:**  
미니배치 크기 1인 SGD는 매 스텝 연산량이 $\mathcal{O}(1)$로 전체 데이터 수 $N$에 독립적이다. 무작위 샘플링으로 인한 그래디언트의 분산(노이즈)은 초기 탐색 단계에서 얕은 국소 최솟값이나 안장점을 벗어나는 데 도움을 주며, 수렴을 보장하기 위해서는 Robbins-Monro 조건 $\sum \gamma_i = \infty, \sum \gamma_i^2 < \infty$ (교재 밖 보충)에 따라 보폭을 점진적으로 줄여야 한다.

---

### 7.3 볼록 집합(Convex Set) 연산의 참/거짓 판정

**문제:**  
다음 명제의 참/거짓을 판정하라. (참이면 증명, 거짓이면 반례 제시)  
a. 임의의 두 볼록집합의 교집합은 볼록집합이다.  
b. 임의의 두 볼록집합의 합집합은 볼록집합이다.  
c. 볼록집합 $B$에서 또 다른 볼록집합 $A$를 뺀 차집합 $B \setminus A$는 볼록집합이다.

**풀이:**  
- **교재 정의 7.2 (볼록 집합, 236쪽):**  
  집합 $C \subseteq \mathbb{R}^D$가 볼록집합이란, 임의의 $x, y \in C$ 및 임의의 $\theta \in [0, 1]$에 대하여 볼록 결합 $(1 - \theta)x + \theta y \in C$가 항상 성립하는 집합이다.

#### a. 교집합 $A \cap B$
1. **판정:** **참 (True)**
2. **증명:**  
   - 임의의 두 점 $x, y \in A \cap B$와 임의의 스칼라 $\theta \in [0, 1]$을 선택한다.  
   - 교집합의 정의에 의해 $x \in A$이고 $x \in B$이며, $y \in A$이고 $y \in B$이다.  
   - 집합 $A$가 볼록집합이므로 정의 7.2에 의해 선분 위의 점 $(1 - \theta)x + \theta y \in A$이다.  
   - 집합 $B$ 또한 볼록집합이므로 정의 7.2에 의해 동일한 점 $(1 - \theta)x + \theta y \in B$이다.  
   - 점 $(1 - \theta)x + \theta y$가 $A$와 $B$ 모두에 속하므로, 교집합의 정의에 의해 $(1 - \theta)x + \theta y \in A \cap B$이다.  
   - 따라서 정의 7.2를 만족하므로 $A \cap B$는 볼록집합이다. (이는 임의의 개수, 심지어 무한개의 볼록집합 교집합으로도 성립한다).

#### b. 합집합 $A \cup B$
1. **판정:** **거짓 (False)**
2. **반례:**  
   - 1차원 실수선 $\mathbb{R}$ 위에서 두 닫힌 구간 $A = [0, 1]$과 $B = [2, 3]$을 생각한다.  
   - 구간은 볼록집합이므로 $A$와 $B$는 각각 볼록집합이다.  
   - 두 집합의 합집합은 $C = A \cup B = [0, 1] \cup [2, 3]$이다.  
   - $x = 1 \in A \subset C$이고 $y = 2 \in B \subset C$를 고른다.  
   - $\theta = 0.5$일 때 두 점의 중점은 다음과 같다.  
     $$(1 - 0.5)(1) + 0.5(2) = 0.5 + 1.0 = 1.5$$  
   - $1.5 \notin [0, 1]$이고 $1.5 \notin [2, 3]$이므로 $1.5 \notin A \cup B$이다.  
   - 두 점을 잇는 선분의 중점이 합집합에 포함되지 않으므로 $A \cup B$는 볼록집합이 아니다.

#### c. 차집합 $B \setminus A$
1. **판정:** **거짓 (False)**
2. **반례 (1차원 구간):**  
   - $B = [0, 3]$ (볼록구간), $A = [1, 2]$ (볼록구간)라 하자.  
   - 차집합은 $B \setminus A = [0, 1) \cup (2, 3]$이다.  
   - $x = 0.5 \in B \setminus A$이고 $y = 2.5 \in B \setminus A$를 고른다.  
   - $\theta = 0.5$일 때 중점은 $\frac{0.5 + 2.5}{2} = 1.5$이다.  
   - $1.5 \in A$이므로 $1.5 \notin B \setminus A$이다. 따라서 $B \setminus A$는 볼록집합이 아니다.  
3. **반례 (2차원 기하학적 직관):**  
   - $\mathbb{R}^2$에서 중심이 원점인 반지름 2의 닫힌 원반 $B = \{x \in \mathbb{R}^2 \mid \|x\| \le 2\}$와 반지름 1의 열린 원반 $A = \{x \in \mathbb{R}^2 \mid \|x\| < 1\}$은 모두 볼록집합이다.  
   - 차집합 $B \setminus A = \{x \in \mathbb{R}^2 \mid 1 \le \|x\| \le 2\}$는 중심에 구멍이 뚫린 도넛 모양(환, annulus)이다.  
   - 점 $x = (-1.5, 0) \in B \setminus A$와 $y = (1.5, 0) \in B \setminus A$를 잇는 선분의 중점은 원점 $(0, 0)$이지만, 원점은 구멍($A$)에 속하므로 $B \setminus A$에 속하지 않는다. 따라서 볼록집합이 아니다.

**답:**  
- **a. 참 (True)**  
- **b. 거짓 (False)**  
- **c. 거짓 (False)**

---

### 7.4 볼록 함수(Convex Function) 연산의 참/거짓 판정

**문제:**  
다음 명제의 참/거짓을 판정하라. (참이면 증명, 거짓이면 반례 제시)  
a. 임의의 두 볼록함수의 합은 볼록함수이다.  
b. 임의의 두 볼록함수의 차는 볼록함수이다.  
c. 임의의 두 볼록함수의 곱은 볼록함수이다.  
d. 임의의 두 볼록함수의 최댓값($\max$)은 볼록함수이다.

**풀이:**  
- **교재 정의 7.3 (볼록 함수, 236쪽):**  
  함수 $f: \mathbb{R}^D \to \mathbb{R}$의 정의역 $\text{dom}(f)$가 볼록집합이고, 임의의 $x, y \in \text{dom}(f)$ 및 $\theta \in [0, 1]$에 대해 다음 부등식이 성립하면 볼록함수이다.  
  $$f((1 - \theta)x + \theta y) \le (1 - \theta)f(x) + \theta f(y)$$

#### a. 합 $f + g$
1. **판정:** **참 (True)**
2. **증명:**  
   - $f$와 $g$가 볼록함수이므로, 임의의 $x, y \in \text{dom}(f) \cap \text{dom}(g)$ 및 $\theta \in [0, 1]$에 대해 다음이 성립한다.  
     $$f((1 - \theta)x + \theta y) \le (1 - \theta)f(x) + \theta f(y)$$  
     $$g((1 - \theta)x + \theta y) \le (1 - \theta)g(x) + \theta g(y)$$  
   - 두 부등식의 양변을 더한다.  
     $$f((1 - \theta)x + \theta y) + g((1 - \theta)x + \theta y) \le (1 - \theta)(f(x) + g(x)) + \theta (f(y) + g(y))$$  
   - 좌변은 $(f + g)((1 - \theta)x + \theta y)$이고, 우변은 $(1 - \theta)(f + g)(x) + \theta (f + g)(y)$이다.  
   - 따라서 정의 7.3에 의해 $f + g$는 볼록함수이다.

#### b. 차 $f - g$
1. **판정:** **거짓 (False)**
2. **반례:**  
   - $f(x) = x^2$과 $g(x) = 2x^2$를 잡는다.  
   - $f''(x) = 2 > 0$, $g''(x) = 4 > 0$이므로 두 함수는 모두 실수 전체에서 엄격히 볼록(strictly convex)하다.  
   - 차 함수는 $h(x) = (f - g)(x) = x^2 - 2x^2 = -x^2$이다.  
   - $h''(x) = -2 < 0$이므로 $h(x)$는 엄격히 오목(concave) 함수이며 볼록함수가 아니다.  
   - (수치 점검: $x = -1, y = 1, \theta = 0.5$에서 $h(0) = 0 > -1 = 0.5 h(-1) + 0.5 h(1)$로 볼록성 부등식 위배).

#### c. 곱 $fg$
1. **판정:** **거짓 (False)**
2. **반례 1 (음수 영역을 포함하는 선형함수):**  
   - $f(x) = x$ (선형함수는 볼록함수), $g(x) = x^2$ (볼록함수)를 잡는다.  
   - 곱 함수는 $h(x) = f(x)g(x) = x^3$이다.  
   - 2계 도함수 $h''(x) = 6x$는 $x < 0$에서 음수이므로, $x < 0$ 영역에서 오목하다.  
   - 예컨대 $x = -2, y = 0, \theta = 0.5$일 때 $h(-1) = -1$이지만, 우변은 $0.5 h(-2) + 0.5 h(0) = 0.5(-8) + 0 = -4$이다.  
   - $-1 \le -4$는 거짓이므로 볼록함수가 아니다.  
3. **반례 2 (비음수 볼록함수의 곱도 성립하지 않는 예):**  
   - $f(x) = x^2 \ge 0$, $g(x) = (x - 1)^2 \ge 0$은 모두 실수 전체에서 비음수 볼록함수이다.  
   - 곱 함수는 $h(x) = x^2(x - 1)^2 = x^4 - 2x^3 + x^2$이다.  
   - 2계 도함수는 $h''(x) = 12x^2 - 12x + 2$이다.  
   - $x = 0.5$에서 $h''(0.5) = 12(0.25) - 12(0.5) + 2 = 3 - 6 + 2 = -1 < 0$.  
   - 따라서 $x = 0.5$ 근처에서 위로 볼록(local maximum)하여 볼록함수가 아니다.

#### d. 최댓값 $\max\{f, g\}$
1. **판정:** **참 (True)**
2. **증명:**  
   - $h(x) = \max\{f(x), g(x)\}$라 하자.  
   - 임의의 $x, y$ 및 $\theta \in [0, 1]$에 대해, $f$의 볼록성에 의해:  
     $$f((1 - \theta)x + \theta y) \le (1 - \theta)f(x) + \theta f(y)$$  
     그런데 $f(x) \le h(x)$이고 $f(y) \le h(y)$이므로:  
     $$f((1 - \theta)x + \theta y) \le (1 - \theta)h(x) + \theta h(y)$$  
   - 마찬가지로 $g$의 볼록성에 의해:  
     $$g((1 - \theta)x + \theta y) \le (1 - \theta)g(x) + \theta g(y) \le (1 - \theta)h(x) + \theta h(y)$$  
   - $h((1 - \theta)x + \theta y) = \max\{f((1 - \theta)x + \theta y), g((1 - \theta)x + \theta y)\}$는 위 두 값의 최댓값이므로, 동일한 상계 이하이다.  
     $$h((1 - \theta)x + \theta y) \le (1 - \theta)h(x) + \theta h(y)$$  
   - 따라서 $h = \max\{f, g\}$는 볼록함수이다.  
   - *(기하학적 보충: 함수의 에피그래프 $\text{epi}(h) = \text{epi}(f) \cap \text{epi}(g)$이며, 7.3(a)에 의해 두 볼록집합의 교집합은 볼록집합이므로 $h$는 볼록함수이다.)*

**답:**  
- **a. 참 (True)**  
- **b. 거짓 (False)**  
- **c. 거짓 (False)**  
- **d. 참 (True)**

---

### 7.5 최적화 문제의 표준 선형계획(Standard Linear Program) 행렬 표현

**문제:**  
다음 최적화 문제
$$\begin{gathered} \max_{x \in \mathbb{R}^2, \xi \in \mathbb{R}} p^\top x + \xi\quad \text{subject to}\quad \xi \ge 0, \\ x_0 \le 0,\quad x_1 \le 3 \end{gathered}$$
를 표준 선형계획($\min c^\top z \text{ subject to } A z \le b$)의 행렬 표기법으로 나타내라. (단, 결정변수 벡터 $x$의 성분 $x_0, x_1$ 표기를 그대로 유지한다.)

**풀이:**  
1. **결정변수 벡터 $z$ 정의:**  
   문제의 최적화 변수는 2차원 벡터 $x = \begin{bmatrix} x_0 \\ x_1 \end{bmatrix} \in \mathbb{R}^2$와 스칼라 슬랙 변수 $\xi \in \mathbb{R}$이다.  
   이를 하나의 3차원 열벡터 $z \in \mathbb{R}^3$으로 통합한다.  
   $$z = \begin{bmatrix} x_0 \\ x_1 \\ \xi \end{bmatrix} \in \mathbb{R}^3$$
2. **목적함수를 표준 최소화($\min$) 꼴로 변환:**  
   주어진 문제는 최대화 문제이다.  
   $$\max \left( p^\top x + \xi \right) = \max \left( p_0 x_0 + p_1 x_1 + \xi \right)$$  
   최적화 이론의 기본 관계 $\max f(z) = -\min (-f(z))$에 따라 목적함수에 음의 부호를 취해 최소화 문제로 변환한다.  
   $$\min \left( -p_0 x_0 - p_1 x_1 - \xi \right)$$  
   이를 $c^\top z$ 형태로 표현하기 위해 계수 벡터 $c \in \mathbb{R}^3$를 구한다.  
   $$c^\top z = \begin{bmatrix} -p_0 & -p_1 & -1 \end{bmatrix} \begin{bmatrix} x_0 \\ x_1 \\ \xi \end{bmatrix} \implies c = \begin{bmatrix} -p_0 \\ -p_1 \\ -1 \end{bmatrix} = \begin{bmatrix} -p \\ -1 \end{bmatrix}$$
3. **부등식 제약조건을 표준 부등식($\le$) 꼴로 변환:**  
   주어진 세 가지 제약식을 각각 $A_i z \le b_i$ 형태로 정리한다.  
   - 첫 번째 제약 $x_0 \le 0$:  
     $$1 \cdot x_0 + 0 \cdot x_1 + 0 \cdot \xi \le 0$$  
   - 두 번째 제약 $x_1 \le 3$:  
     $$0 \cdot x_0 + 1 \cdot x_1 + 0 \cdot \xi \le 3$$  
   - 세 번째 제약 $\xi \ge 0$:  
     양변에 $-1$을 곱하여 부등호 방향을 바꾼다.  
     $$-\xi \le 0 \iff 0 \cdot x_0 + 0 \cdot x_1 + (-1) \cdot \xi \le 0$$
4. **제약 행렬 $A$와 경계 벡터 $b$ 조립:**  
   위의 세 부등식을 행렬-벡터 부등식 $A z \le b$로 결합한다.  
   $$A = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix}, \quad b = \begin{bmatrix} 0 \\ 3 \\ 0 \end{bmatrix}$$  
   *(참고: 제약조건의 행 배치 순서를 문제 원문에 적힌 $\xi \ge 0, x_0 \le 0, x_1 \le 3$ 순으로 둘 경우 $A = \begin{bmatrix} 0 & 0 & -1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}, b = \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix}$가 되며 두 형태는 완전히 동치이다.)*

**답:**  
$$\boldsymbol{\min_{z \in \mathbb{R}^3} c^\top z \quad \text{subject to} \quad A z \le b}$$  
여기서  
$$\begin{gathered} \boldsymbol{z = \begin{bmatrix} x_0 \\ x_1 \\ \xi \end{bmatrix},\quad c = \begin{bmatrix} -p_0 \\ -p_1 \\ -1 \end{bmatrix},} \\ \boldsymbol{A = \begin{bmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ 0 & 0 & -1 \end{bmatrix},\quad b = \begin{bmatrix} 0 \\ 3 \\ 0 \end{bmatrix}} \end{gathered}$$  
*(제약조건을 $\xi \ge 0, x_0 \le 0, x_1 \le 3$ 순으로 배치할 경우 $A = \begin{bmatrix} 0 & 0 & -1 \\ 1 & 0 & 0 \\ 0 & 1 & 0 \end{bmatrix}, b = \begin{bmatrix} 0 \\ 0 \\ 3 \end{bmatrix}$)*

---

### 7.6 2차원 선형계획(LP)의 라그랑주 쌍대 유도 및 수치 검산

**문제:**  
교재 그림 7.9 (예제 7.5, 240쪽)의 선형계획 문제:
$$\begin{gathered} \min_{x \in \mathbb{R}^2} -\begin{bmatrix} 5 \\ 3 \end{bmatrix}^\top \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}\quad \text{subject to} \\ \begin{bmatrix} 2 & 2 \\ 2 & -4 \\ -2 & 1 \\ 0 & -1 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} \le \begin{bmatrix} 33 \\ 8 \\ 5 \\ -1 \\ 8 \end{bmatrix} \end{gathered}$$
의 쌍대 선형계획(Dual Linear Program)을 라그랑주 쌍대성(Lagrange duality)을 이용하여 유도하라. 또한 Python 수치 검산을 통해 원문제와 쌍대문제의 최적값을 확인하고 강쌍대성(Strong Duality)이 성립하는지 검증하라.

**풀이:**  
1. **원문제(Primal LP)의 행렬 기호 정의:**  
   $$\begin{gathered} c = \begin{bmatrix} -5 \\ -3 \end{bmatrix}, \\ A = \begin{bmatrix} 2 & 2 \\ 2 & -4 \\ -2 & 1 \\ 0 & -1 \\ 0 & 1 \end{bmatrix} \in \mathbb{R}^{5 \times 2}, \\ b = \begin{bmatrix} 33 \\ 8 \\ 5 \\ -1 \\ 8 \end{bmatrix} \in \mathbb{R}^5 \end{gathered}$$  
   원문제는 교재 식 (7.39) 표준형 $\min_{x \in \mathbb{R}^2} c^\top x \text{ s.t. } Ax \le b$이다.
2. **라그랑지안(Lagrangian) 구성 (교재 식 7.40, 7.41):**  
   5개의 부등식 제약조건에 대해 비음수 라그랑주 승수 벡터 $\lambda = [\lambda_1, \lambda_2, \lambda_3, \lambda_4, \lambda_5]^\top \ge 0$를 도입한다.  
   $$\begin{aligned} L(x, \lambda) &= c^\top x + \lambda^\top (Ax - b) \\ &= c^\top x + \lambda^\top Ax - \lambda^\top b \end{aligned}$$  
   $x$에 대하여 항을 묶는다.  
   $$L(x, \lambda) = (c + A^\top \lambda)^\top x - b^\top \lambda$$
3. **라그랑주 쌍대 함수 $D(\lambda)$ 유도:**  
   쌍대 함수는 라그랑지안의 $x$에 대한 하한(infimum)으로 정의된다.  
   $$\begin{aligned} D(\lambda) &= \inf_{x \in \mathbb{R}^2} L(x, \lambda) \\ &= \inf_{x \in \mathbb{R}^2} \left[ (c + A^\top \lambda)^\top x - b^\top \lambda \right] \end{aligned}$$  
   $x$에 대한 1차 선형함수는 기울기 벡터 $c + A^\top \lambda$의 값에 따라 거동이 갈린다:  
   - 만약 $c + A^\top \lambda \ne 0$이면: $x$를 $-(c + A^\top \lambda)$ 방향으로 무한히 멀리 보낼 수 있으므로 하한은 $-\infty$이다.  
   - 만약 $c + A^\top \lambda = 0$이면: $x$ 항이 완전히 소거되어 $L(x, \lambda) = -b^\top \lambda$로 일정하므로 하한은 $-b^\top \lambda$이다.  
   따라서 쌍대 함수는 다음과 같다:  
   $$D(\lambda) = \begin{cases} -b^\top \lambda & \text{if } A^\top \lambda + c = 0 \\ -\infty & \text{otherwise} \end{cases}$$
4. **쌍대 선형계획(Dual LP) 작성:**  
   쌍대 문제는 $D(\lambda)$를 $\lambda \ge 0$에 대해 최대화하는 것이다. 유효한 최댓값을 얻기 위해 암묵적 제약조건 $A^\top \lambda + c = 0$을 명시적 등식 제약으로 추가한다.  
   $$\begin{gathered} \max_{\lambda \in \mathbb{R}^5} -b^\top \lambda\quad \text{subject to} \\ A^\top \lambda + c = 0,\quad \lambda \ge 0 \end{gathered}$$  
   $c = \begin{bmatrix} -5 \\ -3 \end{bmatrix}$이므로 $A^\top \lambda + c = 0 \iff A^\top \lambda = \begin{bmatrix} 5 \\ 3 \end{bmatrix}$이다.  
   이를 성분별로 풀어서 명시하면:  

   $$\begin{aligned} &\max_{\lambda \in \mathbb{R}^5} \bigl( -33\lambda_1 - 8\lambda_2 - 5\lambda_3 + \lambda_4 \\ &\quad - 8\lambda_5 \bigr) \end{aligned}$$  

   $$\begin{aligned} &\text{subject to} \\ &\begin{bmatrix} 2 & 2 & -2 & 0 & 0 \\ 2 & -4 & 1 & -1 & 1 \end{bmatrix} \begin{bmatrix} \lambda_1 \\ \lambda_2 \\ \lambda_3 \\ \lambda_4 \\ \lambda_5 \end{bmatrix} \\ &\quad = \begin{bmatrix} 5 \\ 3 \end{bmatrix},\quad \lambda_i \ge 0 \; (i=1,\dots,5) \end{aligned}$$  

   *(부호를 반전하여 표준 최소화 형태로 나타내면 $\min_{\lambda \ge 0} b^\top \lambda \text{ s.t. } A^\top \lambda = -c$로 쓸 수도 있다.)*
5. **Python 수치 검산 및 강쌍대성 검증:**  
   `scipy.optimize.linprog`를 이용해 원문제와 쌍대문제를 푼 결과는 다음과 같다.  
   - **원문제 최적해:**  
     $x^* = \begin{bmatrix} 37/3 \\ 25/6 \end{bmatrix} \approx \begin{bmatrix} 12.3333 \\ 4.1667 \end{bmatrix}$  
     이 점에서 제약 1 ($2x_1 + 2x_2 \le 33$)과 제약 2 ($2x_1 - 4x_2 \le 8$)가 등호로 활성화(active)된다.  
     원문제 최적값:  
     $$p^* = -5\left(\frac{37}{3}\right) - 3\left(\frac{25}{6}\right) = -\frac{185}{3} - \frac{25}{2} = -\frac{445}{6} \approx -74.1667$$  
   - **쌍대문제 최적해:**  
     (교재 밖 보충) 상보 여유성(complementary slackness)에 따라 등호로 묶이지 않은 제약의 승수는 $\lambda_3 = \lambda_4 = \lambda_5 = 0$이다.  
     활성 제약 1, 2에 대해 $2\lambda_1 + 2\lambda_2 = 5$, $2\lambda_1 - 4\lambda_2 = 3$을 연립하여 풀면:  
     $$\lambda_1^* = \frac{13}{6} \approx 2.1667, \quad \lambda_2^* = \frac{1}{3} \approx 0.3333$$  
     쌍대문제 최적값:  
     $$d^* = -b^\top \lambda^* = -33\left(\frac{13}{6}\right) - 8\left(\frac{1}{3}\right) = -\frac{429}{6} - \frac{16}{6} = -\frac{445}{6} \approx -74.1667$$  
   - **강쌍대성 확인:**  
     $$p^* - d^* = -\frac{445}{6} - \left(-\frac{445}{6}\right) = 0$$  
     따라서 쌍대 갭(duality gap)이 0이며, 강쌍대성이 정확히 성립함을 수치적으로 확인하였다.

**답:**  
$$\begin{gathered} \boldsymbol{\max_{\lambda \in \mathbb{R}^5} -b^\top \lambda\quad \text{subject to}} \\ \boldsymbol{A^\top \lambda = \begin{bmatrix} 5 \\ 3 \end{bmatrix},\quad \lambda \ge 0} \end{gathered}$$  
$$\begin{aligned} &\text{풀어쓴 식: } \\ &\boldsymbol{\max_{\lambda \ge 0} \bigl( -33\lambda_1 - 8\lambda_2 - 5\lambda_3 + \lambda_4} \\ &\quad \boldsymbol{- 8\lambda_5 \bigr)} \\ &\boldsymbol{\text{s.t.}\quad \begin{bmatrix} 2 & 2 & -2 & 0 & 0 \\ 2 & -4 & 1 & -1 & 1 \end{bmatrix} \lambda = \begin{bmatrix} 5 \\ 3 \end{bmatrix}} \end{aligned}$$

**확인 (Python 계산 결과 요약):**  
- 원문제 최적해: $x^* = [12.3333, 4.1667]^\top = [37/3, 25/6]^\top$, 최적값 $p^* = -\frac{445}{6} \approx -74.1667$  
- 쌍대문제 최적해: $\lambda^* = [2.1667, 0.3333, 0, 0, 0]^\top = [13/6, 1/3, 0, 0, 0]^\top$, 최적값 $d^* = -\frac{445}{6} \approx -74.1667$  
- $p^* = d^*$로 강쌍대성이 오차 없이 성립한다.

---

### 7.7 2차 계획법(QP)의 라그랑주 쌍대 유도 및 수치 검산

**문제:**  
교재 그림 7.4 (예제 7.6, 241쪽)의 2차 계획법 문제:
$$\begin{gathered} \min_{x \in \mathbb{R}^2} \frac{1}{2} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix}^\top \begin{bmatrix} 2 & 1 \\ 1 & 4 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} + \begin{bmatrix} 5 \\ 3 \end{bmatrix}^\top \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} \\ \text{subject to}\quad \begin{bmatrix} 1 & 0 \\ -1 & 0 \\ 0 & 1 \\ 0 & -1 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} \le \begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \end{bmatrix} \end{gathered}$$
의 쌍대 2차 계획법(Dual QP)을 라그랑주 쌍대성으로 유도하고, 쌍대함수를 $\lambda$에 대한 명시적인 식으로 나타내라. 또한 Python으로 원문제와 쌍대문제의 최적값을 풀어 강쌍대성을 확인하라.

**풀이:**  
1. **문제 정의 및 행렬 기호 설정:**  
   $$\begin{gathered} Q = \begin{bmatrix} 2 & 1 \\ 1 & 4 \end{bmatrix},\quad c = \begin{bmatrix} 5 \\ 3 \end{bmatrix}, \\ A = \begin{bmatrix} 1 & 0 \\ -1 & 0 \\ 0 & 1 \\ 0 & -1 \end{bmatrix},\quad b = \begin{bmatrix} 1 \\ 1 \\ 1 \\ 1 \end{bmatrix} \end{gathered}$$  
   - 행렬 $Q$의 판별: $Q = Q^\top$, $\det(Q) = 2 \cdot 4 - 1 \cdot 1 = 7 > 0$, $\text{tr}(Q) = 6 > 0$이므로 $Q$는 엄격히 양의 정부호($Q \succ 0$)이다.  
   - $Q$의 역행렬:  
     $$Q^{-1} = \frac{1}{7} \begin{bmatrix} 4 & -1 \\ -1 & 2 \end{bmatrix}$$
2. **라그랑지안 구성 (교재 식 7.48):**  
   라그랑주 승수 벡터 $\lambda = [\lambda_1, \lambda_2, \lambda_3, \lambda_4]^\top \ge 0$를 도입한다.  
   $$\begin{aligned} &L(x, \lambda) \\ &\quad = \frac{1}{2} x^\top Q x + c^\top x + \lambda^\top (Ax - b) \\ &\quad = \frac{1}{2} x^\top Q x + (c + A^\top \lambda)^\top x - b^\top \lambda \end{aligned}$$
3. **$x$에 대해 최소화하여 쌍대함수 $D(\lambda)$ 유도 (교재 식 7.49~7.51):**  
   $Q \succ 0$이므로 $L(x, \lambda)$는 $x$에 대해 강볼록(strongly convex) 함수이다. 따라서 1계 편도함수가 0인 점에서 유일한 전역 최솟값을 가진다.  
   $$\nabla_x L(x, \lambda) = Q x + (c + A^\top \lambda) = 0$$  
   $Q$가 가역이므로 $x^*(\lambda)$를 구한다.  
   $$x^*(\lambda) = -Q^{-1}(c + A^\top \lambda)$$  
   이를 $L(x, \lambda)$에 대입한다.  
   $$\begin{aligned} &D(\lambda) = \frac{1}{2} (-Q^{-1}(c + A^\top \lambda))^\top \\ &\quad Q (-Q^{-1}(c + A^\top \lambda)) \\ &\quad + (c + A^\top \lambda)^\top (-Q^{-1}(c + A^\top \lambda)) \\ &\quad - b^\top \lambda \end{aligned}$$  
   $$\begin{aligned} &= \frac{1}{2} (c + A^\top \lambda)^\top Q^{-1} (c + A^\top \lambda) \\ &\quad - (c + A^\top \lambda)^\top Q^{-1} (c + A^\top \lambda) \\ &\quad - b^\top \lambda \end{aligned}$$  
   $$\begin{aligned} &= -\frac{1}{2} (c + A^\top \lambda)^\top Q^{-1} (c + A^\top \lambda) \\ &\quad - b^\top \lambda \end{aligned}$$
4. **쌍대함수 $D(\lambda)$의 성분별 명시적 전개:**  
   $A^\top \lambda$를 계산한다.  
   $$\begin{aligned} A^\top \lambda &= \begin{bmatrix} 1 & -1 & 0 & 0 \\ 0 & 0 & 1 & -1 \end{bmatrix} \begin{bmatrix} \lambda_1 \\ \lambda_2 \\ \lambda_3 \\ \lambda_4 \end{bmatrix} \\ &= \begin{bmatrix} \lambda_1 - \lambda_2 \\ \lambda_3 - \lambda_4 \end{bmatrix} \end{aligned}$$  
   따라서:  
   $$c + A^\top \lambda = \begin{bmatrix} 5 + \lambda_1 - \lambda_2 \\ 3 + \lambda_3 - \lambda_4 \end{bmatrix}$$  
   편의상 $v_1 = 5 + \lambda_1 - \lambda_2, v_2 = 3 + \lambda_3 - \lambda_4$라 두면:  
   $$\begin{aligned} &(c + A^\top \lambda)^\top Q^{-1} (c + A^\top \lambda) \\ &\quad = \frac{1}{7} \begin{bmatrix} v_1 & v_2 \end{bmatrix} \begin{bmatrix} 4 & -1 \\ -1 & 2 \end{bmatrix} \begin{bmatrix} v_1 \\ v_2 \end{bmatrix} \\ &\quad = \frac{1}{7} \left( 4 v_1^2 - 2 v_1 v_2 + 2 v_2^2 \right) \end{aligned}$$  
   또한 $b^\top \lambda = \lambda_1 + \lambda_2 + \lambda_3 + \lambda_4$이다.  
   따라서 쌍대함수 $D(\lambda)$는 다음과 같다:  

   $$\begin{aligned} &D(\lambda) = -\frac{1}{14} \bigl[ 4(5 + \lambda_1 - \lambda_2)^2 \\ &\quad - 2(5 + \lambda_1 - \lambda_2)(3 + \lambda_3 - \lambda_4) \\ &\quad + 2(3 + \lambda_3 - \lambda_4)^2 \bigr] \\ &\quad - (\lambda_1 + \lambda_2 + \lambda_3 + \lambda_4) \end{aligned}$$  

   쌍대 2차 계획 문제는 다음과 같다:  
   $$\max_{\lambda \ge 0} D(\lambda)$$
5. **Python 수치 검산 및 최적값 확인:**  
   `scipy.optimize.minimize`를 통해 원문제와 쌍대문제를 각각 계산한다.  
   - **원문제 최적해:**  
     무제약 최솟점은 $-Q^{-1}c = [-17/7, -1/7]^\top \approx [-2.4286, -0.1429]^\top$로 박스 제약 $[-1, 1]^2$의 경계 $x_1 \ge -1$을 벗어난다.  
     따라서 경계 $-x_1 = 1$, 즉 $x_1 = -1$이 활성화된다.  
     $x_1 = -1$을 대입하고 $x_2$에 대해 최소화하면 $x_2^* = -0.5$이다.  
     $$x^* = \begin{bmatrix} -1.0 \\ -0.5 \end{bmatrix}$$  
     원문제 최적값:  
     $$p^* = f(-1, -0.5) = \frac{1}{2}(2(1) + 2(-1)(-0.5) + 4(0.25)) + 5(-1) + 3(-0.5) = 2 - 6.5 = -4.5$$  
   - **쌍대문제 최적해:**  
     (교재 밖 보충: 상보 여유성) 두 번째 제약($-x_1 \le 1$)만 등호로 묶이므로 $\lambda_1^* = \lambda_3^* = \lambda_4^* = 0$이다.  
     정류 조건(식 (7.49)) $Q x^* + c + A^\top \lambda^* = 0$에서:  
     $$\begin{bmatrix} 2.5 \\ 0 \end{bmatrix} + \begin{bmatrix} -\lambda_2 \\ 0 \end{bmatrix} = 0 \implies \lambda_2^* = 2.5 = \frac{5}{2}$$  
     따라서 쌍대 최적해는 $\lambda^* = [0, 2.5, 0, 0]^\top$이다.  
     쌍대함수 대입 계산:  
     $v_1 = 5 - 2.5 = 2.5, v_2 = 3$.  
     $-\frac{1}{14} [4(6.25) - 2(2.5)(3) + 2(9)] - 2.5 = -\frac{1}{14}[25 - 15 + 18] - 2.5 = -\frac{28}{14} - 2.5 = -2 - 2.5 = -4.5$.  
     $$d^* = -4.5$$  
   - **강쌍대성 확인:**  
     $$p^* = d^* = -4.5$$  
     원문제와 쌍대문제의 최적값이 정확히 일치하여 강쌍대성이 성립한다.

**답:**  
$$\boldsymbol{\max_{\lambda \ge 0} D(\lambda)}$$  
여기서 쌍대함수 $D(\lambda)$는 다음과 같다:  
$$\begin{aligned} &\boldsymbol{D(\lambda) = -\frac{1}{14} \bigl[ 4(5 + \lambda_1 - \lambda_2)^2} \\ &\quad \boldsymbol{- 2(5 + \lambda_1 - \lambda_2)(3 + \lambda_3 - \lambda_4)} \\ &\quad \boldsymbol{+ 2(3 + \lambda_3 - \lambda_4)^2 \bigr]} \\ &\quad \boldsymbol{- (\lambda_1 + \lambda_2 + \lambda_3 + \lambda_4)} \end{aligned}$$  
$$\begin{gathered} \text{subject to} \\ \lambda_1 \ge 0, \; \lambda_2 \ge 0, \; \lambda_3 \ge 0, \; \lambda_4 \ge 0 \end{gathered}$$

**확인 (Python 계산 결과 요약):**  
- 원문제 QP 최적해: $x^* = [-1.0, -0.5]^\top$, 최적값 $p^* = -4.5$  
- 쌍대문제 QP 최적해: $\lambda^* = [0.0, 2.5, 0.0, 0.0]^\top$, 최적값 $d^* = -4.5$  
- $p^* = d^* = -4.5$로 강쌍대성이 완벽히 검증됨.

---

### 7.8 $\ell_2$ 노름 최소화 문제의 라그랑주 쌍대 유도 및 해

**문제:**  
다음 볼록 최적화 문제
$$\begin{gathered} \min_{w \in \mathbb{R}^D} \frac{1}{2} w^\top w\quad \text{subject to}\quad w^\top x \ge 1 \\ (x \ne 0) \end{gathered}$$
의 라그랑주 쌍대 문제를 승수 $\lambda$를 도입하여 유도하고, 쌍대 문제의 해 $\lambda^*$와 원문제의 해 $w^*$를 구하라.

**풀이:**  
1. **부등식 제약조건의 표준형 변환:**  
   $w^\top x \ge 1 \iff 1 - w^\top x \le 0$.
2. **라그랑지안 함수 구성:**  
   비음수 라그랑주 승수 $\lambda \ge 0$를 도입한다.  
   $$L(w, \lambda) = \frac{1}{2} w^\top w + \lambda (1 - w^\top x) = \frac{1}{2} \|w\|^2 - \lambda w^\top x + \lambda$$
3. **$w$에 대해 최소화하여 쌍대 함수 $D(\lambda)$ 유도:**  
   $L(w, \lambda)$는 $w$에 대해 엄격히 볼록(strictly convex)한 2차 함수이다. 1계 편도함수를 구하여 0으로 둔다.  
   $$\nabla_w L(w, \lambda) = w - \lambda x = 0 \implies w^*(\lambda) = \lambda x$$  
   이를 $L(w, \lambda)$에 대입한다.  
   $$D(\lambda) = \frac{1}{2} (\lambda x)^\top (\lambda x) - \lambda (\lambda x)^\top x + \lambda = \frac{1}{2} \lambda^2 \|x\|^2 - \lambda^2 \|x\|^2 + \lambda = \lambda - \frac{1}{2} \lambda^2 \|x\|^2$$
4. **쌍대 문제(Dual Problem) 정식화:**  
   $$\max_{\lambda \ge 0} D(\lambda) = \max_{\lambda \ge 0} \left( \lambda - \frac{1}{2} \lambda^2 \|x\|^2 \right)$$
5. **쌍대 문제의 최적해 $\lambda^*$ 도출:**  
   목적함수 $D(\lambda)$는 $\lambda$에 대해 위로 볼록인 2차 포물선이다 (2계 도함수 $-\|x\|^2 < 0$, $x \ne 0$).  
   $\lambda$에 대해 미분하여 0으로 둔다.  
   $$\frac{d D(\lambda)}{d \lambda} = 1 - \lambda \|x\|^2 = 0 \implies \lambda^* = \frac{1}{\|x\|^2}$$  
   $x \ne 0$이므로 $\|x\|^2 > 0$이며, 따라서 $\lambda^* = \frac{1}{\|x\|^2} > 0$이다. 이는 비음수 제약 $\lambda \ge 0$을 엄격히 만족한다.  
   쌍대 최적값:  
   $$d^* = D(\lambda^*) = \frac{1}{\|x\|^2} - \frac{1}{2} \left(\frac{1}{\|x\|^2}\right)^2 \|x\|^2 = \frac{1}{\|x\|^2} - \frac{1}{2\|x\|^2} = \frac{1}{2\|x\|^2}$$
6. **원문제 최적해 $w^*$ 도출:**  
   3단계에서 구한 최적 관계식 $w^*(\lambda) = \lambda x$에 $\lambda^*$를 대입한다.  
   $$w^* = \lambda^* x = \frac{x}{\|x\|^2}$$  
   원문제 최적값:  
   $$p^* = \frac{1}{2} (w^*)^\top w^* = \frac{1}{2} \left(\frac{x}{\|x\|^2}\right)^\top \left(\frac{x}{\|x\|^2}\right) = \frac{1}{2} \frac{\|x\|^2}{\|x\|^4} = \frac{1}{2\|x\|^2}$$  
   $p^* = d^* = \frac{1}{2\|x\|^2}$이므로 강쌍대성이 성립한다.

**답:**  
- **쌍대 문제:** $\boldsymbol{\max_{\lambda \ge 0} \left( \lambda - \frac{1}{2}\lambda^2 \|x\|^2 \right)}$  
- **쌍대 최적해:** $\boldsymbol{\lambda^* = \frac{1}{\|x\|^2}}$  
- **원문제 최적해:** $\boldsymbol{w^* = \frac{x}{\|x\|^2}}$  
- **최적값:** $\boldsymbol{p^* = d^* = \frac{1}{2\|x\|^2}}$

**확인:**  
기하학적으로 이 문제는 원점에서 초평면 $w^\top x = 1$까지의 최소 유클리드 거리를 갖는 점 $w$를 구하는 문제이다. 원점에서 초평면에 내린 수선의 발은 법선 벡터 $x$ 방향이어야 하므로 $w = c x$이다. 이를 초평면 식에 대입하면 $(cx)^\top x = c \|x\|^2 = 1 \implies c = 1/\|x\|^2 \implies w^* = x / \|x\|^2$. 라그랑주 쌍대성으로 도출한 결과와 기하학적 정사영 결과가 정확히 일치한다. 이는 12장 서포트 벡터 머신(SVM)에서 마진 $\frac{1}{\|w\|}$을 최대화하기 위해 $\frac{1}{2}\|w\|^2$을 최소화하는 원리와 직접 연결된다.

---

### 7.9 음의 엔트로피(Negative Entropy)의 볼록 켤레 함수 유도

**문제:**  
$x \in \mathbb{R}^D$ ($x_d > 0$)의 음의 엔트로피 함수
$$f(x) = \sum_{d=1}^D x_d \log x_d$$
의 볼록 켤레 $f^*(s)$를 표준 내적 하에서 유도하라. (힌트: 적절한 함수의 기울기를 0으로)  
(단, 정의역 $x_d > 0$과 $\log$가 자연로그 $\ln$임을 명시한다.)

**풀이:**  
1. **정의역 및 로그의 밑 명시:**  
   $$f(x) = \sum_{d=1}^D x_d \ln x_d$$  
   여기서 $\log$는 자연로그($\ln$)이며, 정의역은 $\text{dom}(f) = \{x \in \mathbb{R}^D \mid x_d > 0, \forall d = 1, \dots, D\}$이다.  
   각 성분별 함수 $g(t) = t \ln t$의 2계 도함수는 $g''(t) = 1/t > 0$ ($t > 0$)이므로, $f(x)$는 엄격히 볼록함수이다.
2. **볼록 켤레(Convex Conjugate) 정의 적용 (교재 정의 7.4, 242쪽):**  
   표준 내적 $\langle s, x \rangle = \sum_{d=1}^D s_d x_d$에 대해:  

   $$\begin{aligned} &f^*(s) = \sup_{x \in \text{dom}(f)} \left( \langle s, x \rangle - f(x) \right) \\ &\quad = \sup_{x_d > 0} \left( \sum_{d=1}^D s_d x_d - \sum_{d=1}^D x_d \ln x_d \right) \end{aligned}$$

3. **성분별 독립 분해(Coordinate-wise Separation):**  
   목적함수는 각 차원 $d$에 대해 서로 간섭 없이 완전히 분리된다.  

   $$\begin{gathered} f^*(s) = \sum_{d=1}^D \sup_{x_d > 0} \phi_d(x_d), \\ \text{where } \phi_d(x_d) = s_d x_d - x_d \ln x_d \end{gathered}$$

4. **힌트 적용 (기울기를 0으로 설정):**  
   $\phi_d(x_d)$의 2계 도함수는 $\phi_d''(x_d) = -1/x_d < 0$ ($x_d > 0$)이므로 $\phi_d$는 엄격히 오목함수이다. 따라서 1계 미분이 0인 지점에서 유일한 전역 최댓값을 가진다.  
   $$\begin{aligned} \frac{d \phi_d(x_d)}{d x_d} &= s_d - \left( \ln x_d + x_d \cdot \frac{1}{x_d} \right) \\ &= s_d - \ln x_d - 1 = 0 \end{aligned}$$  
   $$\begin{aligned} \ln x_d &= s_d - 1 \\ &\implies x_d^* = \exp(s_d - 1) = e^{s_d - 1} \end{aligned}$$  
   지수함수의 치역은 항상 양수이므로 $x_d^* > 0$은 정의역 조건을 만족한다.
5. **최적해 대입 및 식 정리:**  
   $x_d^*$를 $\phi_d(x_d)$에 대입한다.  
   $$\begin{aligned} \phi_d(x_d^*) &= s_d x_d^* - x_d^* \ln x_d^* \\ &= x_d^*(s_d - \ln x_d^*) \end{aligned}$$  
   여기서 $\ln x_d^* = s_d - 1$이므로:  
   $$\begin{aligned} \phi_d(x_d^*) &= x_d^*(s_d - (s_d - 1)) = x_d^* \cdot 1 \\ &= \exp(s_d - 1) = \frac{1}{e} \exp(s_d) \end{aligned}$$  
   모든 차원에 대해 합산하면:  
   $$\begin{aligned} f^*(s) &= \sum_{d=1}^D \exp(s_d - 1) \\ &= \frac{1}{e} \sum_{d=1}^D \exp(s_d) \end{aligned}$$
6. **유효 정의역 명시:**  
   임의의 $s \in \mathbb{R}^D$에 대해 지수함수의 합은 항상 유한한 실수 값을 가지므로, 볼록 켤레 함수의 유효 정의역은 실수 전체 공간이다.  
   $$\text{dom}(f^*) = \mathbb{R}^D$$

**답:**  
$$\begin{aligned} &\boldsymbol{f^*(s) = \sum_{d=1}^D \exp(s_d - 1)} \\ &\quad \boldsymbol{= \frac{1}{e} \sum_{d=1}^D \exp(s_d)\quad (s \in \mathbb{R}^D)} \end{aligned}$$

**확인:**  
$D=1$, $s=0$이면 $f^*(0)=\sup_{x>0}(-x\log x)$이고, $-\log x-1=0$에서 $x=e^{-1}$, 값은 $e^{-1}$이다. 공식 $e^{0-1}$과 같다. (교재 밖 보충: 정의에서 바로 $\langle s,x\rangle\le f(x)+f^*(s)$가 나온다. 펜첼-영 부등식이다.)

---

### 7.10 일반 2차 형식의 볼록 켤레 함수 유도

**문제:**  
$A \in \mathbb{R}^{D \times D}$가 엄격히 양의 정부호($A \succ 0$, 따라서 가역)일 때, 2차 함수
$$f(x) = \frac{1}{2} x^\top A x + b^\top x + c$$
의 볼록 켤레 함수 $f^*(s)$를 유도하라. (힌트: 적절한 함수의 기울기를 0으로)

**풀이:**  
1. **볼록 켤레 정의 적용 (Definition 7.4):**  
   $$f^*(s) = \sup_{x \in \mathbb{R}^D} \left( s^\top x - f(x) \right) = \sup_{x \in \mathbb{R}^D} \left( s^\top x - \frac{1}{2} x^\top A x - b^\top x - c \right)$$  
   피최대화 함수를 $\psi(x)$라 정의한다.  
   $$\psi(x) = (s - b)^\top x - \frac{1}{2} x^\top A x - c$$
2. **힌트 적용 (기울기를 0으로 설정):**  
   $A$는 양의 정부호이므로 대칭행렬($A = A^\top$)이며 헤시안 $\nabla_x^2 \psi(x) = -A \prec 0$이다.  
   따라서 $\psi(x)$는 엄격히 오목(strictly concave) 함수이므로 1계 미분이 0인 지점에서 유일한 전역 최댓값을 가진다.  
   $$\nabla_x \psi(x) = (s - b) - A x = 0$$  
   $A$가 가역이므로 양변의 왼쪽에 $A^{-1}$을 곱한다.  
   $$x^* = A^{-1}(s - b)$$
3. **최적점 $x^*$ 대입 및 전개:**  
   $x^*$를 $\psi(x)$에 대입한다.  
   $$\psi(x^*) = (s - b)^\top \left( A^{-1}(s - b) \right) - \frac{1}{2} \left( A^{-1}(s - b) \right)^\top A \left( A^{-1}(s - b) \right) - c$$  
   $A = A^\top$이므로 $(A^{-1})^\top = A^{-1}$이며, 둘째 항은 다음과 같이 정리된다.  
   $$\left( A^{-1}(s - b) \right)^\top A \left( A^{-1}(s - b) \right) = (s - b)^\top A^{-1} A A^{-1} (s - b) = (s - b)^\top A^{-1} (s - b)$$  
   따라서:  
   $$\psi(x^*) = (s - b)^\top A^{-1}(s - b) - \frac{1}{2} (s - b)^\top A^{-1}(s - b) - c = \frac{1}{2} (s - b)^\top A^{-1}(s - b) - c$$
4. **유효 정의역 명시:**  
   $A \succ 0$이므로 $A^{-1} \succ 0$이며, 모든 $s \in \mathbb{R}^D$에 대해 유한한 실수 값을 갖는다.  
   $$\text{dom}(f^*) = \mathbb{R}^D$$

**답:**  
$$\begin{gathered} \boldsymbol{f^*(s) = \frac{1}{2} (s - b)^\top A^{-1}(s - b) - c} \\ \boldsymbol{(s \in \mathbb{R}^D)} \end{gathered}$$

**확인:**  
- $b = 0, c = 0$인 경우: $f(x) = \frac{1}{2}x^\top A x \implies f^*(s) = \frac{1}{2}s^\top A^{-1}s$가 되어 교재 예제 7.7 (244쪽)의 결과와 완벽하게 일치한다.  
- 1차원 스칼라 경우 ($f(x) = \frac{1}{2}ax^2 + bx + c$, $a > 0$): $f^*(s) = \frac{(s - b)^2}{2a} - c$가 되어 고전적 르장드르 변환 결과와 정확히 부합한다.

---

### 7.11 힌지 손실의 볼록 켤레 및 Moreau 평활화(Smoothed Hinge Loss)

**문제:**  
서포트 벡터 머신(SVM)에서 사용되는 힌지 손실(hinge loss) 함수
$$L(\alpha) = \max\{0, 1 - \alpha\}$$
의 볼록 켤레 $L^*(\beta)$를 구하라 ($\beta$는 쌍대 변수).  
이어서 $\ell_2$ 근접항(proximal term)을 더한 함수 $L^*(\beta) + \frac{\gamma}{2}\beta^2$ ($\gamma > 0$)의 볼록 켤레를 구하라.  
(결과가 매끄러운 힌지 손실, 즉 Huber 손실과 유사한 꼴이 됨을 구간별로 명시하고, 유효 정의역 밖에서 $+\infty$가 되는 구간을 밝힐 것.)

**풀이:**  

#### Part 1: 힌지 손실 $L(\alpha)$의 볼록 켤레 $L^*(\beta)$ 유도
1. **볼록 켤레 정의 적용 (Definition 7.4):**  
   $$\begin{aligned} L^*(\beta) &= \sup_{\alpha \in \mathbb{R}} \left( \beta \alpha - L(\alpha) \right) \\ &= \sup_{\alpha \in \mathbb{R}} \left( \beta \alpha - \max\{0, 1 - \alpha\} \right) \end{aligned}$$  
   피최대화 함수를 $g(\alpha; \beta) = \beta \alpha - \max\{0, 1 - \alpha\}$라 두고, $\alpha$의 구간별로 나눈다.  

   $$\begin{aligned} &g(\alpha; \beta) \\ &\quad = \begin{cases} \beta \alpha - (1 - \alpha) & \\ \quad = (\beta + 1)\alpha - 1 & \text{if } \alpha \le 1 \\ \beta \alpha - 0 = \beta \alpha & \text{if } \alpha > 1 \end{cases} \end{aligned}$$

2. **$\beta$의 값에 따른 상한($\sup$)의 유한성 분석:**  
   - $\alpha \to +\infty$ 극한:  
     $\alpha > 1$ 영역에서 $g(\alpha; \beta) = \beta \alpha$이다.  
     만약 $\beta > 0$이면 $\lim_{\alpha \to +\infty} \beta \alpha = +\infty$가 되어 상한은 $+\infty$로 발산한다.  
     따라서 상한이 유한하기 위한 필수 조건은 **$\beta \le 0$**\ 이다.  
   - $\alpha \to -\infty$ 극한:  
     $\alpha \le 1$ 영역에서 $g(\alpha; \beta) = (\beta + 1)\alpha - 1$이다.  
     만약 $\beta + 1 < 0$ (즉 $\beta < -1$)이면, $\lim_{\alpha \to -\infty} (\beta + 1)\alpha = +\infty$가 되어 상한은 $+\infty$로 발산한다.  
     따라서 상한이 유한하기 위한 필수 조건은 **$\beta \ge -1$**\ 이다.  
   - 따라서 $L^*(\beta)$가 유한한 값을 갖는 유효 정의역(effective domain)은 닫힌 구간 $[-1, 0]$이다. 그 밖에서는 $+\infty$이다.
3. **유효 구간 $\beta \in [-1, 0]$에서의 최댓값 계산:**  
   - $\beta \in [-1, 0]$이면 $\beta + 1 \ge 0$이므로, $\alpha \le 1$ 구간에서 직선 $(\beta + 1)\alpha - 1$의 기울기는 비음수($\ge 0$)이며 단조 증가한다.  
   - 또한 $\beta \le 0$이므로, $\alpha \ge 1$ 구간에서 직선 $\beta \alpha$의 기울기는 비양수($\le 0$)이며 단조 감소한다.  
   - 두 직선은 $\alpha = 1$에서 연속으로 만난다:  
     $$g(1; \beta) = (\beta + 1)(1) - 1 = \beta, \quad g(1; \beta) = \beta(1) = \beta$$  
   - 따라서 최댓값은 $\alpha = 1$에서 유일하게 달성되며 그 값은 $\beta$이다.  
     $$\sup_{\alpha \in \mathbb{R}} g(\alpha; \beta) = \beta$$
4. **$L^*(\beta)$ 정리:**  
   $$L^*(\beta) = \begin{cases} \beta & \text{if } -1 \le \beta \le 0 \\ +\infty & \text{otherwise} \end{cases}$$

#### Part 2: $h(\beta) = L^*(\beta) + \frac{\gamma}{2}\beta^2$의 볼록 켤레 $h^*(u)$ 유도
1. **함수 $h(\beta)$ 규정:**  
   $\gamma > 0$은 스무딩 하이퍼파라미터이다. $L^*(\beta)$의 유효 정의역이 $[-1, 0]$이므로:  
   $$h(\beta) = \begin{cases} \beta + \frac{\gamma}{2}\beta^2 & \text{if } -1 \le \beta \le 0 \\ +\infty & \text{otherwise} \end{cases}$$
2. **켤레 함수 $h^*(u)$의 정의 (원변수를 $u$로 표기):**  
   $$h^*(u) = \sup_{\beta \in \mathbb{R}} \left( u \beta - h(\beta) \right) = \sup_{-1 \le \beta \le 0} \left( u \beta - \left( \beta + \frac{\gamma}{2}\beta^2 \right) \right) = \sup_{-1 \le \beta \le 0} \left( (u - 1)\beta - \frac{\gamma}{2}\beta^2 \right)$$
3. **제약 구간 $[-1, 0]$에서의 2차 함수 최적화:**  
   목적함수 $\psi(\beta) = (u - 1)\beta - \frac{\gamma}{2}\beta^2$는 위로 볼록인 2차 포물선이다.  
   무제약 극대점:  
   $$\psi'(\beta) = (u - 1) - \gamma \beta = 0 \implies \bar{\beta} = \frac{u - 1}{\gamma}$$  
   그러나 $\beta$는 닫힌 구간 $[-1, 0]$으로 제한되므로, 최적해 $\beta^*$는 $\bar{\beta}$를 $[-1, 0]$에 사영(projection/clipping)한 점이다.  
   $$\beta^* = \text{clip}\left( \frac{u - 1}{\gamma}, -1, 0 \right)$$
4. **$u$의 값에 따른 구간별 최적해 및 함숫값 계산:**  
   - **구간 1 ($u > 1$):**  
     $\bar{\beta} = \frac{u - 1}{\gamma} > 0$이므로 오른쪽 경계에 걸려 $\beta^* = 0$이다.  
     $$h^*(u) = \psi(0) = 0$$  
   - **구간 2 ($1 - \gamma \le u \le 1$):**  
     $-1 \le \frac{u - 1}{\gamma} \le 0$이므로 $\bar{\beta}$가 구간 내부에 위치하여 $\beta^* = \frac{u - 1}{\gamma}$이다.  
     $$h^*(u) = (u - 1)\left(\frac{u - 1}{\gamma}\right) - \frac{\gamma}{2}\left(\frac{u - 1}{\gamma}\right)^2 = \frac{(u - 1)^2}{\gamma} - \frac{(u - 1)^2}{2\gamma} = \frac{(1 - u)^2}{2\gamma}$$  
   - **구간 3 ($u < 1 - \gamma$):**  
     $\bar{\beta} = \frac{u - 1}{\gamma} < -1$이므로 왼쪽 경계에 걸려 $\beta^* = -1$이다.  
     $$h^*(u) = (u - 1)(-1) - \frac{\gamma}{2}(-1)^2 = 1 - u - \frac{\gamma}{2}$$
5. **구간 연결점에서의 연속성 및 $C^1$ 미분가능성 검증:**  
   - $u = 1$에서:  
     - 함숫값: $\frac{(1 - 1)^2}{2\gamma} = 0$, 우측 $0$ (연속).  
     - 도함수: $\frac{d}{du}\left[\frac{(1-u)^2}{2\gamma}\right]_{u=1} = -\frac{1-u}{\gamma}\Big|_{u=1} = 0$, 우측 $0$ ($C^1$ 연속).  
   - $u = 1 - \gamma$에서:  
     - 함숫값: $1 - (1 - \gamma) - \frac{\gamma}{2} = \frac{\gamma}{2}$, 우측 $\frac{(1-(1-\gamma))^2}{2\gamma} = \frac{\gamma^2}{2\gamma} = \frac{\gamma}{2}$ (연속).  
     - 도함수: $\frac{d}{du}[1 - u - \frac{\gamma}{2}] = -1$, 우측 $-\frac{1-(1-\gamma)}{\gamma} = -1$ ($C^1$ 연속).  
   - 따라서 $h^*(u)$는 전 구간에서 연속 미분 가능한 평활화된 함수(Smoothed Hinge Loss / Huberized Hinge Loss)이다.

**답:**  
1. **힌지 손실의 볼록 켤레:**  
   $$\boldsymbol{L^*(\beta) = \begin{cases} \beta & \text{if } -1 \le \beta \le 0 \\ +\infty & \text{otherwise} \end{cases}}$$  
2. **근접항을 더한 함수의 볼록 켤레 (Smoothed Hinge Loss):**  

   $$\begin{aligned} &\boldsymbol{h^*(u)} \\ &\quad \boldsymbol{= \begin{cases} 0 & \text{if } u > 1 \\ \frac{(1 - u)^2}{2\gamma} & \text{if } 1 - \gamma \le u \le 1 \\ 1 - u - \frac{\gamma}{2} & \text{if } u < 1 - \gamma \end{cases}} \end{aligned}$$

**확인:**  
$\gamma \to 0^+$ 극한을 취하면 중간의 2차 포물선 완충 구간 $[1 - \gamma, 1]$의 폭이 0으로 줄어들어 원래의 꺾인 힌지 손실 $\max\{0, 1 - u\}$로 수렴한다. $\gamma > 0$일 때는 모서리(kink)가 부드럽게 연결되어 전 구간에서 그래디언트가 연속이므로, 서브그래디언트 없이 L-BFGS나 가속 경사하강법을 안정적으로 적용할 수 있다. (교재 밖 보충: 이 기법은 최적화 이론에서 켤레 공간의 2차 정규화와 원 공간의 인피멀 컨볼루션(infimal convolution)을 통한 모로 포락선(Moreau envelope) 스무딩에 해당한다.)
