import numpy as np
from tslearn.metrics import soft_dtw


def parse_attributes(attributes):
    return set(attr.strip().lower() for attr in attributes.split(','))


def has_common_attributes(attrs1, attrs2):
    return bool(attrs1 & attrs2)


def soft_dtw_score(series1, series2, gamma=1.0):
    return soft_dtw(series1, series2, gamma=gamma)


def edr_float(S1, S2, epsilon=0.1):
    n, m = len(S1), len(S2)
    dp = np.zeros((n + 1, m + 1), dtype=float)

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = abs(S1[i - 1] - S2[j - 1]) / epsilon
            dp[i][j] = min(
                dp[i - 1][j - 1] + cost,
                dp[i - 1][j] + 1,
                dp[i][j - 1] + 1
            )

    return dp[n][m]


def weighted_dtw_float(series1, series2, weights):
    return np.sqrt(np.sum(weights * (np.array(series1) - np.array(series2))**2))


def twed_float(S1, S2, lambda_param=0.5, nu=0.1):
    n, m = len(S1), len(S2)
    dp = np.full((n + 1, m + 1), np.inf, dtype=float)
    dp[0, 0] = 0

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            cost = (S1[i - 1] - S2[j - 1])**2
            dp[i][j] = min(
                dp[i - 1][j - 1] + cost + nu * abs(i - j),
                dp[i - 1][j] + lambda_param,
                dp[i][j - 1] + lambda_param
            )

    return dp[n][m]


def find_nearest_neighbor_with_heuristics(df, random_row_index, weights=None):
    random_row = df.iloc[random_row_index]
    random_cluster = random_row["Cluster"]
    random_attributes = parse_attributes(random_row["Attributes"])
    random_series_normalized = np.array(
        list(map(float, random_row["Normalized_Data"].split(',')))
    )

    cluster_data = df[(df["Cluster"] == random_cluster) & (df.index != random_row_index)]

    candidates = cluster_data[
        ~cluster_data["Attributes"].apply(
            lambda x: has_common_attributes(random_attributes, parse_attributes(x))
        )
    ]

    if candidates.empty:
        return None, None

    best_candidate, best_index, best_score = None, None, float("inf")

    for candidate_index, candidate_row in candidates.iterrows():
        candidate_series_normalized = np.array(
            list(map(float, candidate_row["Normalized_Data"].split(',')))
        )

        scores = {
            "sdtw": soft_dtw_score(random_series_normalized, candidate_series_normalized),
            "edr_float": edr_float(random_series_normalized, candidate_series_normalized),
            "w_dtw_float": weighted_dtw_float(
                random_series_normalized, candidate_series_normalized, weights or [1] * len(random_series_normalized)
            ),
            "twed_float": twed_float(random_series_normalized, candidate_series_normalized),
        }

        overall_score = sum(scores.values())
        if overall_score < best_score:
            best_score = overall_score
            best_candidate = candidate_row
            best_index = candidate_index

    return random_row, best_candidate


def get_two_rows(df):
    random_index = np.random.randint(len(df))
    random_row, nearest_row = find_nearest_neighbor_with_heuristics(df, random_index)

    if nearest_row is None:
        return None, None

    return random_row.to_dict(), nearest_row.to_dict()