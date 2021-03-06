import { IRequestProps } from '~/modules/tracing/components/HTTP/Request';
import { IEvent } from '~/modules/tracing/graphql/queries/events';
import { getSpanIdFromEvent, getDirectionFromEvent, getTypeFromEvent, getReporterId, getTimestampFromEvent } from '~/modules/tracing/logic/event';
import { HTTPVerb } from '~/modules/tracing/components/HTTP/HTTPVerb';

export const httpEventToRequest = (event: IEvent, peerService: string): IRequestProps => {
  const {
    statusCode,
    method,
    url,
  } = event.payload.tags.http
  const headers = {} // event.payload.tags.http.headers // TODO
  const body = JSON.parse(event.payload.payload)  // TODO

  return {
    spanId: getSpanIdFromEvent(event),
    direction: getDirectionFromEvent(event),
    status: statusCode,
    eventType: getTypeFromEvent(event),
    service: getReporterId(event),
    verb: method as HTTPVerb,
    peerService,
    endpoint: url,
    headers,
    body,
    timestamp: getTimestampFromEvent(event),
  }
}
