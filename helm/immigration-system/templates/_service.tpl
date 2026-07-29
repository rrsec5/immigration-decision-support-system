{{/*
Generate Kubernetes Service for application components
*/}}

{{- define "immigration-system.service" }}

apiVersion: v1
kind: Service

metadata:
  name: {{ .name }}
  namespace: {{ .root.Values.namespace }}

  labels:
    {{- include "immigration-system.labels" .root | nindent 4 }}

    app.kubernetes.io/component: {{ .name }}

spec:
  selector:
    app.kubernetes.io/component: {{ .name }}

  ports:
    - port: {{ .config.service.port }}

      targetPort: {{ .config.container.port }}

  type: {{ .config.service.type }}

{{- end }}