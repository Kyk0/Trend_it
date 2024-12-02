from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .services import get_two_rows
from .data_processing import process_and_save_if_needed


class RandomNeighborView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            df = process_and_save_if_needed()

            if df.empty:
                return Response({"error": "Database is empty."}, status=status.HTTP_404_NOT_FOUND)

            random_row, nearest_row = get_two_rows(df)

            if random_row is None or nearest_row is None:
                return Response(
                    {"error": "No suitable neighbor found for the selected row."},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {"random_row": random_row, "nearest_row": nearest_row},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)