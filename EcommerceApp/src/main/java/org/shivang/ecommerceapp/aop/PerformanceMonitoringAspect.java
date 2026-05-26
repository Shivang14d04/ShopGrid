package org.shivang.ecommerceapp.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@Aspect
public class PerformanceMonitoringAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(PerformanceMonitoringAspect.class);
    @Around("execution(* org.shivang.ecommerceapp.service.*.*(..))")
    public Object monitorTime(ProceedingJoinPoint jp) throws Throwable {
        long start = System.currentTimeMillis();
        Object obj =  jp.proceed();

        long end  = System.currentTimeMillis();

        LOGGER.info("Time taken by " + jp.getSignature().getName() + ":"+ (end-start)+"ms");
        return obj;
    }

}
