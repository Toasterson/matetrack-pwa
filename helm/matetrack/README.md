# MateTrack PWA Helm Chart

A Helm chart for deploying MateTrack PWA - a Progressive Web App for tracking expenses at events.

## Description

MateTrack is a lightweight PWA built with vanilla JavaScript that helps track expenses during events. This Helm chart deploys the application using a secure Chainguard-based container image with nginx.

## Prerequisites

- Kubernetes 1.20+
- Helm 3.8+
- Ingress controller (nginx recommended)
- cert-manager (for TLS certificates)

## Installing the Chart

To install the chart with the release name `matetrack`:

```bash
helm install matetrack oci://ghcr.io/toasterson/matetrack-pwa/helm/matetrack
```

To install with custom values:

```bash
helm install matetrack oci://ghcr.io/toasterson/matetrack-pwa/helm/matetrack \
  --set ingress.hosts[0].host=matetrack.example.com \
  --set ingress.tls[0].hosts[0]=matetrack.example.com
```

## Uninstalling the Chart

To uninstall/delete the `matetrack` deployment:

```bash
helm delete matetrack
```

## Configuration

The following table lists the configurable parameters of the MateTrack chart and their default values.

| Parameter | Description | Default |
|-----------|-------------|---------|
| `replicaCount` | Number of replicas | `1` |
| `image.repository` | Container image repository | `ghcr.io/toasterson/matetrack-pwa` |
| `image.tag` | Container image tag | `chainguard` |
| `image.pullPolicy` | Image pull policy | `IfNotPresent` |
| `service.type` | Kubernetes service type | `ClusterIP` |
| `service.port` | Service port | `80` |
| `service.targetPort` | Container port | `8080` |
| `ingress.enabled` | Enable ingress | `true` |
| `ingress.className` | Ingress class name | `nginx` |
| `ingress.hosts[0].host` | Hostname | `matetrack.wegmueller.it` |
| `ingress.tls[0].secretName` | TLS secret name | `matetrack-tls` |
| `resources.limits.cpu` | CPU limit | `100m` |
| `resources.limits.memory` | Memory limit | `128Mi` |
| `resources.requests.cpu` | CPU request | `50m` |
| `resources.requests.memory` | Memory request | `64Mi` |
| `autoscaling.enabled` | Enable HPA | `false` |
| `autoscaling.minReplicas` | Minimum replicas | `1` |
| `autoscaling.maxReplicas` | Maximum replicas | `100` |

## Security Features

This chart implements several security best practices:

- **Non-root user**: Runs as user ID 65532 (nonroot)
- **Read-only root filesystem**: Container filesystem is read-only
- **Dropped capabilities**: All Linux capabilities are dropped
- **Security context**: Enforces security policies at pod and container level
- **Chainguard image**: Uses distroless, minimal attack surface container image

## Example Custom Values

```yaml
# values.yaml
ingress:
  enabled: true
  className: "nginx"
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
  hosts:
    - host: matetrack.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: matetrack-example-tls
      hosts:
        - matetrack.example.com

resources:
  limits:
    cpu: 200m
    memory: 256Mi
  requests:
    cpu: 100m
    memory: 128Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 80
```

## Health Checks

The chart includes both liveness and readiness probes:

- **Liveness probe**: Ensures the container is running
- **Readiness probe**: Ensures the container is ready to serve traffic

Both probes check the HTTP endpoint on the root path (`/`).

## Flux CD Integration

This chart is designed to work with Flux CD. See the `flux/` directory for example Flux configurations.

## Development

To test the chart locally:

```bash
# Lint the chart
helm lint helm/matetrack

# Template the chart
helm template matetrack helm/matetrack

# Install from local chart
helm install matetrack helm/matetrack --dry-run --debug
```

## Support

For issues and feature requests, please visit: https://github.com/Toasterson/matetrack-pwa/issues