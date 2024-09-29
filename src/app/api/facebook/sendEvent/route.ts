
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { event_name, user_data, custom_data } = await req.json();

  if (!event_name || !user_data) {
    return NextResponse.json({ message: 'Dados inválidos' }, { status: 400 });
  }

  const pixelId = '537943838759167'; // Seu ID do Pixel
  const accessToken = 'EAAQ6kCwZC2n0BO5dPlYw0sm6zryLz9x6Jckaw9PdjZCq5BXzFwW4wE8Fh7Vd2kaiyyZB4qFqtpXL1wWZCMTjyi7xN2IFeeQzuhEifhMOzr5zMuogE0WqZBRsuEGejNYDxlZCpkwBfaBqoolzaQ8uEYAy4HNT5ymql1nUsYFiouWSfZA51b0drf8TkWkHEBTws2IRgZDZD'; // Use variável de ambiente para segurança

  const url = `https://graph.facebook.com/v14.0/${pixelId}/events`;

  const body = {
    data: [
      {
        event_name,
        event_time: Math.floor(new Date().getTime() / 1000),
        user_data,
        custom_data,
        action_source: 'website',
      },
    ],
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao enviar evento para o Facebook:', errorData);
      return NextResponse.json({ message: 'Erro ao enviar evento' }, { status: response.status });
    }

    return NextResponse.json({ message: 'Evento enviado com sucesso' }, { status: 200 });
  } catch (error) {
    console.error('Erro na API de Conversões:', error);
    return NextResponse.json({ message: 'Erro interno do servidor' }, { status: 500 });
  }
}

